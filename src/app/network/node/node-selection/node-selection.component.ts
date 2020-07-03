import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';

import { MatMenuTrigger } from '@angular/material/menu';

import { AppConfigService } from '../../../config/app-config/app-config.service';
import { ColorService } from '../../services/color.service';
import { ModelService } from '../../../model/model.service';
import { NetworkConfigService } from '../../network-config/network-config.service';
import { NetworkControllerService } from '../../network-controller/network-controller.service';
import { NetworkService } from '../../services/network.service';

import { Data } from '../../../classes/data';
import { AppNode } from '../../../classes/appNode';
import { SimNode } from '../../../classes/simNode';
import { SimModel } from '../../../classes/simModel';


@Component({
  selector: 'app-node-selection',
  templateUrl: './node-selection.component.html',
  styleUrls: ['./node-selection.component.scss'],
})
export class NodeSelectionComponent implements OnInit, OnChanges {
  @Input() data: Data;
  @Input() node: AppNode;
  @Input() selection: boolean = false;
  @Output() nodeChange: EventEmitter<any> = new EventEmitter();
  @Output() dataChange: EventEmitter<any> = new EventEmitter();
  public collection: SimNode;
  public configModel: any = {};
  public linkedNode: AppNode;
  public models: any[] = [];
  public options: any = {};

  constructor(
    private _appConfigService: AppConfigService,
    private _modelService: ModelService,
    private _networkService: NetworkService,
    private _colorService: ColorService,
    public _networkConfigService: NetworkConfigService,
  ) {
  }

  ngOnInit(): void {
    // console.log('Init node selection')
    this.update()
  }

  ngOnChanges(): void {
    // console.log('Update node selection')
    this.update()
  }

  color(): string {
    return this._colorService.node(this.node.idx);
  }

  update(): void {
    if (this.node == undefined) return
    this.collection = this.data.simulation.collections[this.node.idx];
    var model = this.data.simulation.getModel(this.collection);
    this.configModel = this._modelService.config(model);
    this.configModel.params.forEach(param => {
      if (!(param.id in this.collection.params)) {
        this.collection.params[param.id] = param.value;
      }
    })
    var models = this._modelService.list(this.collection.element_type);
    this.models = models.map(model => { return { value: model, label: this._modelService.config(model).label } });
  }

  isRecorder(): boolean {
    return this.collection.element_type == 'recorder';
  }

  nodeDisplay(): string {
    return this._networkService.isNodeSelected(this.node, this.data, true, false) ? '' : 'none';
  }

  selectNode(node: AppNode): void {
    this._networkService.selectNode(node, this.collection.element_type);
  }

  paramDisplay(obj: any, param: string): boolean {
    if (obj == undefined) return
    return obj.hasOwnProperty('display') ? obj.display.includes(param) : true;
  }

  onDataChange(data: Data): void {
    // console.log('Change input value in node selection')
    this.update()
    this.dataChange.emit(this.data)
  }

  onNodeChange(node: AppNode): void {
    this.nodeChange.emit(this.node)
  }

  onValueChange(value: any): void {
    // console.log('Change input value in node selection')
    this.dataChange.emit(this.data)
  }

}
