import { Component, Input, OnInit, OnChanges, OnDestroy, Output, EventEmitter } from '@angular/core';

import { MatMenuTrigger } from '@angular/material/menu';

import { AppConfigService } from '../../../config/app-config/app-config.service';
import { ColorService } from '../../services/color.service';
import { ModelService } from '../../../model/model.service';
import { NetworkConfigService } from '../../network-config/network-config.service';
import { NetworkService } from '../../services/network.service';

import { Data } from '../../../classes/data';
import { AppNode } from '../../../classes/appNode';
import { SimCollection } from '../../../classes/simCollection';


@Component({
  selector: 'app-node-controller',
  templateUrl: './node-controller.component.html',
  styleUrls: ['./node-controller.component.scss'],
})
export class NodeControllerComponent implements OnInit, OnChanges, OnDestroy {
  @Input() data: Data;
  @Input() node: AppNode;
  @Output() dataChange: EventEmitter<any> = new EventEmitter();
  @Output() nodeChange: EventEmitter<any> = new EventEmitter();
  private subscription: any;
  public collection: SimCollection;
  public collections: SimCollection[] = [];
  public configModel: any = {};
  public linkedNode: AppNode;
  public models: any[] = [];
  public nodes: AppNode[] = [];
  public options: any = {};
  public recordables: string[] = [];
  public simModel: any;

  constructor(
    private _appConfigService: AppConfigService,
    private _modelService: ModelService,
    private _networkService: NetworkService,
    public _colorService: ColorService,
    public _networkConfigService: NetworkConfigService,
  ) {
  }

  ngOnInit(): void {
    // console.log('Init node controller')
    this.subscription = this._networkService.update.subscribe((data: Data) => this.update())
    this.update()
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  ngOnChanges(): void {
    // console.log('Update node controller')
    this.update()
  }

  color(): string {
    return this._colorService.node(this.node.idx);
  }

  update(): void {
    if (this.node == undefined) return
    this.collection = this.data.simulation.collections[this.node.idx];
    this.nodes = this.data.app.nodes.filter(node => this.data.simulation.collections[node.idx].element_type == this.collection.element_type && node != this.node);
    this.collections = this.nodes.map(node => this.data.simulation.collections[node.idx])
    var models = this._modelService.list(this.collection.element_type);
    this.models = models.map(model => { return { value: model, label: this._modelService.config(model).label } });
    this.simModel = this.data.simulation.models[this.collection.model];
    if (this.simModel == undefined) return
    this.configModel = this._modelService.config(this.simModel.existing);
    this.updateRecordFrom()
  }

  updateRecordFrom(): void {
    if (this.simModel == undefined) return
    if (this.simModel.existing != 'multimeter') return
    let recordedNeurons = this.data.simulation.connectomes.filter(connectome => connectome.source == this.node.idx)
    if (recordedNeurons.length == 1) {
      var collections = this.data.simulation.collections;
      let recordedNeuron = collections[recordedNeurons[0]['target']];
      this.recordables = this._modelService.config(this.data.simulation.models[recordedNeuron.model].existing).recordables || [];
      if (this.collection.params.hasOwnProperty('record_from')) {
        this.collection.params['record_from'] = this.collection.params['record_from'].filter(
          rec => this.recordables.includes(rec));
      } else {
        this.collection.params['record_from'] = this.recordables.includes('V_m') ? ['V_m'] : [];
      }
    }
  }

  isRecorder(): boolean {
    return this.collection.element_type == 'recorder';
  }

  nodeDisplay(): string {
    return this._networkService.isNodeSelected(this.node, this.data) ? '' : 'none';
  }

  paramDisplay(model: string, param: string): boolean {
    if (model == undefined) return
    var appModel = this.data.app.models[model];
    return appModel.hasOwnProperty('display') ? appModel.display.includes(param) : true;
  }

  onDataChange(data: Data): void {
    this.updateRecordFrom()
    this.dataChange.emit(this.data)
  }

  onCollectionChange(collection: SimCollection): void {
    this.dataChange.emit(this.data)
  }

  onNodeChange(node: AppNode): void {
    this.nodeChange.emit(this.node)
  }

  onValueChange(value: any): void {
    // console.log('Node controller on value change: ' + value)
    this.dataChange.emit(this.data)
  }

  onRecordChange(event: any): void {
    this.dataChange.emit(this.data)
  }

  onParamHide(param: string): void {
    var model = this.data.app.models[this.collection.model];
    model['display'] = model.display.filter(d => d != param);
  }
}
