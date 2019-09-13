import { Component, OnInit, OnChanges, Input } from '@angular/core';

import { AppConfigService } from '../../../config/app-config/app-config.service';
import { ColorService } from '../../services/color.service';
import { FormatService } from '../../../services/format/format.service';
import { ModelService } from '../../../model/model.service';
import { NetworkService } from '../../services/network.service';

import { Data } from '../../../classes/data';


@Component({
  selector: 'app-node-list',
  templateUrl: './node-list.component.html',
  styleUrls: ['./node-list.component.scss']
})
export class NodeListComponent implements OnInit, OnChanges {
  @Input() data: Data;
  @Input() idx: number;
  @Input() selective: boolean = false;
  public node: any = {};
  public collection: any = {};
  public model: any = {};
  public modelConfig: any = {};
  public color: string = '';

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

  advanced() {
    return this._appConfigService.config['app'].level == 'advanced';
  }

  update() {
    if (this.idx == undefined) return
    this.node = this.data.app.nodes[this.idx];
    this.collection = this.data.simulation.collections[this.idx];
    this.model = this.data.simulation.models[this.collection.model];
    this.modelConfig = this._modelService.config(this.model.existing);
    this.color = this._colorService.node(this.node);
  }

  isSpatial() {
    return this.collection.hasOwnProperty('spatial');
  }

  paramDisplay(param) {
    var model = this.data.app.models[this.collection.model];
    return model.hasOwnProperty('display') ? model.display.includes(param) || !this.selective: true;
  }

  isSelected() {
    return this._networkService.isSelected(this.node, null);
  }

  onClick() {
    this._networkService.selectNode(this.node)
  }

}
