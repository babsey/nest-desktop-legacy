import { Component, Input, OnInit, OnChanges } from '@angular/core';

import { ColorService } from '../../services/color/color.service';
import { ConfigService } from '../../config/config.service';
import { ControllerService } from '../../controller/controller.service';
import { DataService } from '../../services/data/data.service';
import { SimulationService } from '../../simulation/simulation.service';
import { SketchService } from '../../sketch/sketch.service';


@Component({
  selector: 'app-link-controller',
  templateUrl: './link-controller.component.html',
  styleUrls: ['./link-controller.component.css'],
})
export class LinkControllerComponent implements OnInit, OnChanges {
  @Input() idx: any;
  public data: any;
  public link: any;
  public colors: any;
  public slider: any = {}
  public options: any;
  public synModel: any;

  constructor(
    public _colorService: ColorService,
    public _configService: ConfigService,
    public _controllerService: ControllerService,
    public _dataService: DataService,
    public _simulationService: SimulationService,
    public _sketchService: SketchService,
  ) { }

  ngOnInit() {
    this.update()
  }

  ngOnChanges() {
    this.update()
  }

  update() {
    this.link = this._dataService.data.connectomes[this.idx];
    this.colors = {
      pre: this._colorService.nodeIdx(this.link.pre),
      post: this._colorService.nodeIdx(this.link.post),
      weight: this._colorService.link(this),
    };
    var connectionConfig = this._configService.config.nest.connection;
    var connRule = this.link.conn_spec ? this.link.conn_spec.rule : 'all_to_all';
    this.slider.connection = connectionConfig[connRule]['options'] || {};
    var synModel = 'model' in this.link.syn_spec ? this.link.syn_spec.model : "static_synapse";
    var modelConfig = this._configService.config.nest.model;
    this.synModel = modelConfig[synModel]
    this.slider.synapse = this.synModel['options'] || {};
  }

  keys(dict) {
    return Object.keys(dict)
  }

  onSelectConnRule(rule) {
    this.link.conn_spec = {}
    this.link.conn_spec.rule = rule;
    var options = this._configService.config.nest.connection[rule].options;
    for (var key in options) {
      this.link.conn_spec[key] = options[key].value;
    }
    this.update()
  }

  onSelectSynModel(model) {
    this.link.syn_spec.model = model;
    this.update()
  }

  onChange() {
    // console.log('Change value in link controller')
    this.update()
    this._sketchService.update.emit()
    this._dataService.history(this._dataService.data)
    this._simulationService.run()
  }

  deleteLink(idx) {
    var data = this._dataService.data;
    this._dataService.history(data)

    var connectomes = data.connectomes.filter(d => d.idx != idx);
    connectomes.forEach((d, i) => {
      d.idx = i;
    })
    data.connectomes = connectomes;

    this._sketchService.update.emit()
    this._dataService.records = this._dataService.records.filter(d => d.recorder.idx != idx)
    if (!this._dataService.options.edit) {
      this._simulationService.run()
    }
  }
}
