import { Component, OnInit, OnChanges, Input } from '@angular/core';

import { AppConfigService } from '../../../config/app-config/app-config.service';
import { ColorService } from '../../services/color.service';
import { FormatService } from '../../../services/format/format.service';
import { ModelService } from '../../../model/model.service';
import { NetworkService } from '../../services/network.service';

import { Data } from '../../../classes/data';
import { AppNode } from '../../../classes/appNode';
import { SimNode } from '../../../classes/simNode';
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
  public collection: SimNode;
  public modelConfig: any = {};

  constructor(
    private _appConfigService: AppConfigService,
    private _colorService: ColorService,
    private _modelService: ModelService,
    private _networkService: NetworkService,
    public _formatService: FormatService,
  ) {
  }

  ngOnInit(): void {
    this.update()
  }

  ngOnChanges(): void {
    // console.log('Update node list')
    this.update()
  }

  color(): string {
    return this._colorService.node(this.node.idx);
  }

  update(): void {
    if (this.node == undefined) return
    this.collection = this.data.simulation.collections[this.node.idx];
    const model = this.data.simulation.getModel(this.collection);
    this.modelConfig = this._modelService.config(model);
  }

  paramDisplay(param: string): boolean {
    return this.node.hasOwnProperty('display') ? this.node.display.includes(param) || !this.selective: true;
  }

  isSelected(): boolean {
    return this._networkService.isNodeSelected(this.node, this.data, false);
  }

  onClick(): void {
    this._networkService.selectNode(this.node);
  }

}
