import { Component, OnInit, OnChanges, Input } from '@angular/core';

import { AppConfigService } from '../../../config/app-config/app-config.service';
import { ColorService } from '../../services/color.service';
import { FormatService } from '../../../services/format/format.service';
import { ModelService } from '../../../model/model.service';
import { NetworkService } from '../../services/network.service';

import { Data } from '../../../classes/data';
import { AppNode } from '../../../classes/appNode';
import { SimCollection } from '../../../classes/simCollection';
import { SimModel } from '../../../classes/simModel';

import { listAnimation } from '../../../animations/list-animation';


@Component({
  selector: 'app-node-list',
  templateUrl: './node-list.component.html',
  styleUrls: ['./node-list.component.scss'],
  animations: [
    listAnimation
  ]
})
export class NodeListComponent implements OnInit, OnChanges {
  @Input() data: Data;
  @Input() node: AppNode;
  @Input() selective: boolean = false;
  public collection: SimCollection;
  public model: SimModel;
  public modelConfig: any = {};

  constructor(
    private _appConfigService: AppConfigService,
    private _colorService: ColorService,
    private _modelService: ModelService,
    private _networkService: NetworkService,
    public _formatService: FormatService,
  ) {
  }

  ngOnInit() {
    this.update()
  }

  ngOnChanges() {
    // console.log('Update node list')
    this.update()
  }

  advanced(): boolean {
    return this._appConfigService.config['app'].advanced;
  }

  color(): string {
    if (!this.node) return 'black';
    return this._colorService.node(this.node);
  }

  update(): void {
    if (this.node == undefined) return
    this.collection = this.data.simulation.collections[this.node.idx];
    this.model = this.data.simulation.models[this.collection.model];
    this.modelConfig = this._modelService.config(this.model.existing);
  }

  isSpatial(): boolean {
    return this.collection.hasOwnProperty('spatial');
  }

  paramDisplay(param: string): boolean {
    var model = this.data.app.models[this.collection.model];
    if (!model) return
    return model.hasOwnProperty('display') ? model.display.includes(param) || !this.selective: true;
  }

  isSelected(): boolean {
    return this._networkService.isNodeSelected(this.node, this.data, false);
  }

  onClick(): void {
    this._networkService.selectNode(this.node);
  }

}
