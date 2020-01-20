import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';

import { MatMenuTrigger } from '@angular/material';

import { AppConfigService } from '../../../config/app-config/app-config.service';
import { ColorService } from '../../services/color.service';
import { ModelService } from '../../../model/model.service';
import { NetworkConfigService } from '../../network-config/network-config.service';
import { NetworkControllerService } from '../../network-controller/network-controller.service';
import { NetworkService } from '../../services/network.service';

import { Data } from '../../../classes/data';
import { AppNode } from '../../../classes/appNode';
import { SimCollection } from '../../../classes/simCollection';
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
  public collection: SimCollection;
  public configModel: any = {};
  public linkedNode: AppNode;
  public model: SimModel;
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

  advanced(): boolean {
    return this._appConfigService.config['app'].advanced;
  }

  color(): string {
    return this._colorService.node(this.node);
  }

  update(): void {
    if (this.node == undefined) return
    this.collection = this.data.simulation.collections[this.node.idx];
    this.model = this.data.simulation.models[this.collection.model];
    this.configModel = this._modelService.config(this.model.existing);
    this.configModel.params.forEach(param => {
      if (!(param.id in this.model.params)) {
        this.model.params[param.id] = param.value;
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

  isSpatial(): boolean {
    return this.collection.hasOwnProperty('spatial')
  }

  onDataChange(data: Data): void {
    // console.log('Change input value in node selection')
    this.update()
    this.dataChange.emit(this.data)
  }

  onValueChange(value: any): void {
    // console.log('Change input value in node selection')
    this.dataChange.emit(this.data)
  }

}
