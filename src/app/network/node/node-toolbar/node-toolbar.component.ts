import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { MatMenuTrigger } from '@angular/material/menu';

import { AppConfigService } from '../../../config/app-config/app-config.service';
import { AppService } from '../../../app.service';
import { ColorService } from '../../services/color.service';
import { ModelService } from '../../../model/model.service';
import { NetworkService } from '../../services/network.service';

import { Data } from '../../../classes/data';
import { AppNode } from '../../../classes/appNode';
import { SimNode } from '../../../classes/simNode';
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

  loadModels(): void {
    if (!this.node) return
    var models = this._modelService.list(this.simNode().element_type);
    this.models = models.map(model => { return { value: model, label: this._modelService.config(model).label } });
  }

  simNode(): SimNode {
    return this.data.simulation.collections[this.node.idx];
  }

  color(): string {
    return this._colorService.node(this.node.idx);
  }

  selectNode(node: AppNode): void {
    this._networkService.selectNode(node, this.simNode().element_type);
  }

  selectModel(event: any): void {
    var simNode = this.simNode();
    // simNode.model = event.value;
    var params = {};
    let configModel = this._modelService.config(simNode.model);
    configModel.params.map(param => params[param.id] = param.value);
    simNode.params = params;
    this.setLevel(1)
    if (simNode.element_type == 'recorder') {
      this._networkService.recorderChanged = true;
    }
    if (simNode.model != 'multimeter') {
      delete this.simNode().params['record_from']
    }
    this.data.clean();
    this._networkService.update.emit(this.data)
    this.dataChange.emit(this.data)
  }

  setLevel(level: number): void {
    var simNode = this.simNode();
    this.node.display = [];
    let configModel = this._modelService.config(simNode.model);
    configModel.params.map(param => {
      if (param.level <= level) {
        this.node.display.push(param.id)
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
