import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ColorService } from '../services/color.service';
import { ModelService } from '../../model/model.service';
import { NetworkConfigService } from '../network-config/network-config.service';
import { NetworkControllerService } from '../network-controller/network-controller.service';
import { NetworkService } from '../services/network.service';

import { Data } from '../../classes/data';

@Component({
  selector: 'app-link-sketch',
  templateUrl: './link-sketch.component.html',
  styleUrls: ['./link-sketch.component.scss']
})
export class LinkSketchComponent implements OnInit {
  @Input() data: Data;
  @Input() idx: number;
  @Output() nodeClick: EventEmitter<any> = new EventEmitter();
  public link: any = {};
  public connectome: any = {};
  public postColor: string;
  public preColor: string;

  constructor(
    private _modelService: ModelService,
    private _networkConfigService: NetworkConfigService,
    private _networkControllerService: NetworkControllerService,
    private _networkService: NetworkService,
    public _colorService: ColorService,
  ) { }

  ngOnInit() {
    this.update()
  }

  update() {
    if (this.idx == undefined) return
    this.link = this.data.app.links[this.idx];
    this.connectome = this.data.simulation.connectomes[this.idx];
    let nodes = this.data.app.nodes;
    this.preColor = this._colorService.node(nodes[this.connectome.pre]);
    this.postColor = this._colorService.node(nodes[this.connectome.post]);
  }

  collection(idx) {
    return this.data.simulation.collections[idx];
  }

  source() {
    return this.data.app.nodes[this.connectome.pre];
  }

  target() {
    return this.data.app.nodes[this.connectome.post];
  }

  isSpatial(idx) {
    var collection = this.collection(idx);
    return collection.hasOwnProperty('spatial');
  }

  selectNode(idx) {
    var node = this.data.app.nodes[idx];
    var elementType = this.data.simulation.collections[idx].element_type;
    this._networkService.selectNode(node, elementType);
  }

  selectLink() {
    this._networkService.selectLink(this.link)
  }

}
