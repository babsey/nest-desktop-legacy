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
  public collections: SimCollection[] = [];
  public collection: SimCollection;
  public configModel: any = {};
  public linkedNode: AppNode;
  public model: string;
  public models: any[] = [];
  public nodes: AppNode[] = [];
  public options: any = {};
  public record_from = [];
  public recordables: string[] = [];

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
    this.subscription = this._networkService.update.subscribe((data: Data) => this.updateRecordFrom())
    this.update()
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  ngOnChanges(): void {
    // console.log('Update node controller')
    this.update()
  }

  advanced(): boolean {
    return this._appConfigService.config['app'].advanced;
  }

  color(): string {
    var nodes = this.data.app.nodes;
    var node = typeof this.node['color'] == 'number' ? nodes[this.node['color']] : this.node;
    return this._colorService.node(node);
  }

  update(): void {
    if (this.node == undefined) return
    this.collection = this.data.simulation.collections[this.node.idx];
    this.nodes = this.data.app.nodes.filter(node => this.data.simulation.collections[node.idx].element_type == this.collection.element_type && node != this.node);
    this.collections = this.nodes.map(node => this.data.simulation.collections[node.idx])
    this.model = this.collection.model;
    this.updateParams()
    var models = this._modelService.list(this.collection.element_type);
    this.models = models.map(model => { return { value: model, label: this._modelService.config(model).label } });
  }

  updateParams(): void {
    var simModel = this.data.simulation.models[this.model];
    this.configModel = this._modelService.config(simModel.existing);
    this.configModel.params.forEach(param => {
      if (!(param.id in simModel.params)) {
        simModel.params[param.id] = param.value;
      }
    })
    this.updateRecordFrom()
  }

  updateRecordFrom(): void {
    if (!this.data.simulation.models.hasOwnProperty(this.model)) return
    var model = this.data.simulation.models[this.model];
    if (model.existing != 'multimeter') return
    let recordedNeurons = this.data.simulation.connectomes.filter(connectome => connectome.source == this.node.idx)
    if (recordedNeurons.length > 0) {
      var collections = this.data.simulation.collections;
      let recordedNeuron = collections[recordedNeurons[0]['target']];
      this.recordables = this._modelService.config(this.data.simulation.models[recordedNeuron.model].existing).recordables || [];
      if (model.params.hasOwnProperty('record_from')) {
        this.record_from = model.params['record_from'];
      } else {
        this.record_from = this.recordables.includes('V_m') ? ['V_m'] : [];
        model.params['record_from'] = this.record_from;
      }
    }
  }

  isRecorder(): boolean {
    return this.collection.element_type == 'recorder';
  }

  isSpatial(): boolean {
    return this.collection.hasOwnProperty('spatial')
  }

  nodeDisplay(): string {
    return this._networkService.isNodeSelected(this.node, this.data) ? '' : 'none';
  }

  paramDisplay(obj: any, param: string): boolean {
    if (obj == undefined) return
    return obj.hasOwnProperty('display') ? obj.display.includes(param) : true;
  }

  onDataChange(data: Data): void {
    this.updateParams()
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

  onRecordChange(): void {
    var model = this.data.simulation.models[this.model];
    model.params['record_from'] = this.record_from;
    this.dataChange.emit(this.data)
  }

  onParamHide(param: string): void {
    var model = this.data.app.models[this.model];
    model['display'] = model.display.filter(d => d != param);
  }
}
