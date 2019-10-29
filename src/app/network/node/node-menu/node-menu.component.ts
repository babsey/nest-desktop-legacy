import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';

import { ColorService } from '../../services/color.service';
import { ModelService } from '../../../model/model.service';
import { NetworkService } from '../../services/network.service';
import { NetworkSketchService } from '../../network-sketch/network-sketch.service';
import { PositionService } from '../../services/position.service';

import { Data } from '../../../classes/data';
import { AppNode } from '../../../classes/appNode';
import { SimCollection } from '../../../classes/simCollection';

@Component({
  selector: 'app-node-menu',
  templateUrl: './node-menu.component.html',
  styleUrls: ['./node-menu.component.scss']
})
export class NodeMenuComponent implements OnInit, OnChanges {
  @Input() data: Data;
  @Input() node: AppNode;
  @Input() disabled: boolean = false;
  @Output() dataChange: EventEmitter<any> = new EventEmitter();
  @Output() nodeChange: EventEmitter<any> = new EventEmitter();
  public collection: SimCollection;
  public collections: SimCollection[];
  public colors: string[];
  public configModel: any;
  public linkedNode: AppNode;
  public model: string;
  public models: any[] = [];
  public nodes: AppNode[] = [];

  constructor(
    private _colorService: ColorService,
    private _modelService: ModelService,
    private _networkService: NetworkService,
    private _networkSketchService: NetworkSketchService,
    private _positionService: PositionService,
  ) { }

  ngOnInit() {
    this.update()
  }

  ngOnChanges() {
    this.update()
  }

  update(): void {
    this.collections = this.data.simulation.collections;
    this.collection = this.collections[this.node.idx];
    this.nodes = this.data.app.nodes.filter(node => this.collections[node.idx].element_type == this.collection.element_type && node != this.node);
    this.colors = this._colorService.colors();
    this.model = this.collection.model;
    var models = this._modelService.list(this.collection.element_type);
    this.models = models.map(model => { return { value: model, label: this._modelService.config(model).label } });
    var simModel = this.data.simulation.models[this.model];
    this.configModel = this._modelService.config(simModel.existing);
  }

  color(): string {
    return this._colorService.node(this.node);
  }

  selectColor(color: string): void {
    if (color == 'none') {
      delete this.node['color'];
    } else {
      this.node['color'] = color;
    }
    this.nodeChange.emit(this.node)
  }

  setLevel(level: number): void {
    var model = this.data.app.models[this.model];
    model.display = [];
    this.configModel.params.map(param => {
      if (param.level <= level) {
        model.display.push(param.id)
      }
    })
  }

  resetParameters(): void {
    var simModel = this.data.simulation.models[this.model];
    simModel.params = {};
    this.configModel.params.forEach(param => {
      simModel.params[param.id] = param.value
    })
    this.dataChange.emit(this.data)
  }

  isSpatial(): boolean {
    return this.collection.hasOwnProperty('spatial')
  }

  setSpatial(): void {
    this.collection['spatial'] = {
      'edge_wrap': false,
      'extent': [1, 1],
      'center': [0, 0]
    };
    this.collection.spatial.positions = this._positionService.freePositions(this.collection.n, this.collection.spatial);
    this.dataChange.emit(this.data)
  }

  unsetSpatial(): void {
    delete this.collection['spatial'];
    this.dataChange.emit(this.data)
  }

  deleteNode(): void {
    this.data.app.nodes = this.data.app.nodes.filter((node, idx) => idx != this.node.idx);
    this.data.simulation.collections = this.data.simulation.collections.filter((node, idx) => idx != this.node.idx);
    this.data.app.nodes.forEach((node, idx) => node.idx = idx)

    var links = this.data.app.links.filter(link => {
      var connectome = this.data.simulation.connectomes[link.idx];
      return connectome.pre != this.node.idx && connectome.post != this.node.idx;
    });
    if (links.length != this.data.simulation.connectomes.length) {
      links.forEach((link, idx) => link.idx = idx)
      this.data.app.links = links;
      var connectomes = this.data.simulation.connectomes.filter(connectome => connectome.pre != this.node.idx && connectome.post != this.node.idx);
      connectomes.forEach(connectome => {
        connectome.pre = connectome.pre > this.node.idx ? connectome.pre - 1 : connectome.pre;
        connectome.post = connectome.post > this.node.idx ? connectome.post - 1 : connectome.post;
      })
      this.data.simulation.connectomes = connectomes;
    }

    this._networkService.resetSelection();
    this._networkSketchService.reset();
    this.dataChange.emit(this.data)
  }

}
