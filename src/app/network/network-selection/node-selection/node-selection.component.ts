import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';

import { AppConfigService } from '../../../config/app-config/app-config.service';
import { ColorService } from '../../services/color.service';
import { PositionService } from '../../services/position.service';
import { ModelService } from '../../../model/model.service';
import { NetworkConfigService } from '../../network-config/network-config.service';
import { NetworkControllerService } from '../../network-controller/network-controller.service';
import { NetworkService } from '../../services/network.service';


import { Data } from '../../../classes/data';

@Component({
  selector: 'app-node-selection',
  templateUrl: './node-selection.component.html',
  styleUrls: ['./node-selection.component.scss'],
})
export class NodeSelectionComponent implements OnInit, OnChanges {
  @Input() data: Data;
  @Input() idx: number;
  @Input() selection: boolean = false;
  @Output() selectionChange: EventEmitter<any> = new EventEmitter();
  @Output() nodeChange: EventEmitter<any> = new EventEmitter();
  public node: any = {};
  public collection: any = {};
  public color: string;
  public configModel: any = {};
  public linkedNode: any = null;
  public model: any = {};
  public models: any[] = [];
  public options: any = {};
  public toggleColorPicker: boolean = false;

  constructor(
    private _appConfigService: AppConfigService,
    private _modelService: ModelService,
    private _networkConfigService: NetworkConfigService,
    private _networkControllerService: NetworkControllerService,
    private _networkService: NetworkService,
    private _positionService: PositionService,
    public _colorService: ColorService,
  ) {
  }

  ngOnInit() {
    // console.log('Init node selection')
    this.update()
  }

  ngOnChanges() {
    // console.log('Update node selection')
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
    this.updateParams()
    var models = this._modelService.list(this.collection.element_type);
    this.models = models.map(model => { return { value: model, label: this._modelService.config(model).label } });
    this.color = this._colorService.node(this.node);
  }

  updateParams() {
    this.configModel = this._modelService.config(this.model.existing);
    this.configModel.params.forEach(param => {
      if (!(param.id in this.model.params)) {
        this.model.params[param.id] = param.value;
      }
    })
  }

  setLevel(level: number) {
    var model = this.data.app.models[this.collection.model];
    model.display = [];
    this.configModel.params.map(param => {
      if (param.level <= level) {
        model.display.push(param.id)
      }
    })
  }

  isRecorder() {
    return this.collection.element_type == 'recorder';
  }

  nodeDisplay() {
    return this._networkService.isNodeSelected(this.node, this.data) ? '' : 'none';
  }

  selectNode(node: any) {
    this._networkService.selectNode(node, this.collection.element_type);
  }

  selectModel(event) {
    var model = event.value;
    this.model['existing'] = model;
    this.data.app.models[this.collection.model].display = [];
    this.model.params = {};
    this.updateParams();
    this.nodeChange.emit(this.data)
  }

  selectColor(color: string) {
    if (color == 'none') {
      delete this.node['color'];
      this.color = this._colorService.node(this.node);
    } else {
      this.color = color;
      this.node['color'] = color;
    }
    this.nodeChange.emit(this.data)
  }

  deleteNode() {
    this._networkService.resetMouseVars();
    this.data.app.nodes = this.data.app.nodes.filter((node, idx) => idx != this.idx);
    this.data.simulation.collections = this.data.simulation.collections.filter((node, i) => i != this.idx);
    this.data.app.nodes.forEach((node, idx) => {
      node.idx = idx;
    })

    var links = this.data.app.links.filter(link => {
      var connectome = this.data.simulation.connectomes[link.idx];
      return connectome.pre != this.idx && connectome.post != this.idx;
    });
    if (links.length != this.data.simulation.connectomes.length) {

      links.forEach((link, idx) => {
        link.idx = idx;
      })
      this.data.app.links = links;
      var connectomes = this.data.simulation.connectomes.filter(connectome => connectome.pre != this.idx && connectome.post != this.idx);
      connectomes.forEach(connectome => {
        connectome.pre = connectome.pre > this.idx ? connectome.pre - 1 : connectome.pre;
        connectome.post = connectome.post > this.idx ? connectome.post - 1 : connectome.post;
      })
      this.data.simulation.connectomes = connectomes;
    }

    this.nodeChange.emit(this.data)
  }

  paramDisplay(obj: any, param: any) {
    if (obj == undefined) return
    return obj.hasOwnProperty('display') ? obj.display.includes(param) : true;
  }

  isSpatial() {
    return this.collection.hasOwnProperty('spatial')
  }

  spatialEvent(event: any) {
    if (event.option.selected) {
      this.collection['spatial'] = {
        'edge_wrap': false,
        'extent': [1, 1],
        'center': [0, 0]
      };
      this.collection['spatial']['positions'] = this._positionService.freePositions(this.collection);
    } else {
      delete this.collection.spatial;
    }
    this.nodeChange.emit(this.data)
  }

  onSelection() {
    this.selection = !this.selection;
    this.selectionChange.emit(this.selection);
  }

  onNodeChange(value) {
    // console.log('Change input value in node selection')
    this.collection.n = value;
    this.nodeChange.emit(this.data)
  }

}
