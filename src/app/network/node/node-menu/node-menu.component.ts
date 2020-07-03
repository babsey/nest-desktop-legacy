import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';

import { ColorService } from '../../services/color.service';
import { ModelService } from '../../../model/model.service';
import { NetworkService } from '../../services/network.service';
import { NetworkSketchService } from '../../network-sketch/network-sketch.service';
import { PositionService } from '../../services/position.service';
import { SimulationEventService } from '../../../simulation/services/simulation-event.service';

import { Data } from '../../../classes/data';
import { AppNode } from '../../../classes/appNode';
import { SimNode } from '../../../classes/simNode';


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
  public collection: SimNode;
  public collections: SimNode[];
  public colors: string[];
  public configModel: any;
  public linkedNode: AppNode;
  public model: string;
  public models: any[] = [];
  public nodes: AppNode[] = [];
  public isRecorder: boolean = false;

  constructor(
    private _colorService: ColorService,
    private _modelService: ModelService,
    private _networkService: NetworkService,
    private _networkSketchService: NetworkSketchService,
    private _positionService: PositionService,
    private _simulationEventService: SimulationEventService,
  ) { }

  ngOnInit(): void {
    this.update()
  }

  ngOnChanges(): void {
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
    var model = this.data.simulation.getModel(this.collection)
    this.configModel = this._modelService.config(model);
    this.isRecorder = this.data.simulation.collections[this.node.idx].element_type == 'recorder';
  }

  color(): string {
    return this._colorService.node(this.node.idx);
  }

  selectColor(color: string): void {
    this.node['color'] = color == 'none' ? undefined : color;
    this.data.clean();
    this.nodeChange.emit(this.node)
  }

  setLevel(level: number): void {
    this.node.display = [];
    this.configModel.params.map(param => {
      if (param.level <= level) {
        this.node.display.push(param.id)
      }
    })
    this.updateParams()

    this.nodeChange.emit(this.node);
  }

  updateParams(): void {
    this.configModel.params.forEach(param => {
      if (!(param.id in this.collection.params)) {
        this.collection.params[param.id] = param.value;
      }
    })
    this.updateRecordFrom()
  }

  updateRecordFrom(): void {
    var model = this.data.simulation.getModel(this.collection);
    if (model != 'multimeter') return
    let recordedNeurons = this.data.simulation.connectomes.filter(connectome => connectome.source == this.node.idx)
    if (recordedNeurons.length > 0) {
      let recordedNeuron = this.data.simulation.collections[recordedNeurons[0]['target']];
      let recordedModel = this.data.simulation.getModel(recordedNeuron);
      var recordables = this._modelService.config(recordedModel).recordables || [];
      if (!this.node.params.hasOwnProperty('record_from')) {
        this.node.params['record_from'] = recordables.includes('V_m') ? ['V_m'] : [];
      }
    }
  }

  resetParameters(): void {
    this.collection.params = {};
    this.configModel.params.forEach(param => this.collection.params[param.id] = param.value)
    this.dataChange.emit(this.data)
  }

  setSpatial(): void {
    var positions = this._positionService.freePositions(this.collection.n, this.collection.spatial);
    this.collection.spatial = {
      'edge_wrap': false,
      extent: [1, 1],
      center: [0, 0],
      positions: positions,
    };
    this.data.clean();
    this.dataChange.emit(this.data)
  }

  unsetSpatial(): void {
    this.collection.spatial = {};
    this.data.clean();
    this.dataChange.emit(this.data)
  }

  deleteNode(): void {
    this._networkService.resetSelection();
    this._networkSketchService.reset();
    this.data.deleteNode(this.node);
    this.dataChange.emit(this.data)
  }

  hasRecords(): boolean {
    return this._simulationEventService.records.length > 0;
  }

  downloadEvents(): void {
    this._simulationEventService.download(this.data, this.node)
  }

}
