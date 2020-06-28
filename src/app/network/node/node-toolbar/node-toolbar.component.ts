import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { MatMenuTrigger } from '@angular/material/menu';

import { AppConfigService } from '../../../config/app-config/app-config.service';
import { AppService } from '../../../app.service';
import { ColorService } from '../../services/color.service';
import { ModelService } from '../../../model/model.service';
import { NetworkService } from '../../services/network.service';

import { Data } from '../../../classes/data';
import { AppNode } from '../../../classes/appNode';
import { SimCollection } from '../../../classes/simCollection';
import { SimModel } from '../../../classes/simModel';


@Component({
  selector: 'app-node-toolbar',
  templateUrl: './node-toolbar.component.html',
  styleUrls: ['./node-toolbar.component.scss']
})
export class NodeToolbarComponent implements OnInit, OnChanges {
  @Input() data: Data;
  @Input() node: AppNode;
  @Input() disabled: boolean = false;
  @Output() dataChange: EventEmitter<any> = new EventEmitter();
  @Output() nodeChange: EventEmitter<any> = new EventEmitter();
  public linkedNode: AppNode;
  public models: any[] = [];

  @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
  public contextMenuPosition = { x: '0px', y: '0px' };

  constructor(
    private _appConfigService: AppConfigService,
    private _appService: AppService,
    private _modelService: ModelService,
    private _networkService: NetworkService,
    public _colorService: ColorService,
  ) { }

  ngOnInit(): void {
    this.loadModels()
  }

  ngOnChanges(): void {
    this.loadModels()
  }

  label(): string {
    return this.collection().model.split('-')[1]
  }

  loadModels(): void {
    if (!this.node) return
    var models = this._modelService.list(this.collection().element_type);
    this.models = models.map(model => { return { value: model, label: this._modelService.config(model).label } });
  }

  collection(): SimCollection {
    return this.data.simulation.collections[this.node.idx];
  }

  simModel(): SimModel {
    var collection = this.collection()
    return this.data.simulation.models[collection.model];
  }

  color(): string {
    return this._colorService.node(this.node.idx);
  }

  selectNode(node: AppNode): void {
    this._networkService.selectNode(node, this.collection().element_type);
  }

  // disfunctional, to link other model.
  linkModel(model: string, changeEmit: boolean = true): void {
    var collection = this.collection();
    collection.model = model;
    let modelIdx = parseInt(model.split('-')[1]);
    this.linkedNode = modelIdx == this.node.idx ? null : this.data.app.nodes[modelIdx];
    if (changeEmit) {
      this.dataChange.emit(this.data)
    }
  }

  selectModel(event: any): void {
    var appModel = this.data.app.models[this.collection().model];
    var simModel = this.simModel();
    simModel['existing'] = event.value;
    var params = {};
    let configModel = this._modelService.config(simModel.existing);
    configModel.params.map(param => params[param.id] = param.value);
    simModel.params = params;
    this.setLevel(1)
    if (this.collection().element_type == 'recorder') {
      this._networkService.recorderChanged = true;
    }
    if (event.value != 'multimeter') {
      delete this.collection().params['record_from']
    }
    this.data.clean();
    this._networkService.update.emit(this.data)
    this.dataChange.emit(this.data)
  }

  setLevel(level: number): void {
    var appModel = this.data.app.models[this.collection().model];
    var simModel = this.simModel();
    appModel.display = [];
    let configModel = this._modelService.config(simModel.existing);
    configModel.params.map(param => {
      if (param.level <= level) {
        appModel.display.push(param.id)
      }
    })
  }

  onMouseOver(event: MouseEvent): void {
    this._appService.rightClick = true;
  }

  onMouseOut(event: MouseEvent): void {
    this._appService.rightClick = false;
  }

  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.openMenu();
  }

}
