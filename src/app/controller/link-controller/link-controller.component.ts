import { Component, Input, OnInit, OnChanges } from '@angular/core';

import { ColorService } from '../../services/color/color.service';
import { ConfigService } from '../../config/config.service';
import { ControllerService } from '../../controller/controller.service';
import { DataService } from '../../services/data/data.service';
import { SimulationService } from '../../simulation/simulation.service';
import { SketchService } from '../../sketch/sketch.service';

import {
    faLongArrowAltRight,
    faEllipsisV,
    faCrosshairs,
    faEraser,
    faBan,
    faMinusCircle,
    faCheck,
} from '@fortawesome/free-solid-svg-icons';

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

  public faLongArrowAltRight = faLongArrowAltRight;
  public faEllipsisV = faEllipsisV;
  public faCrosshairs = faCrosshairs;
  public faEraser = faEraser;
  public faBan = faBan;
  public faMinusCircle = faMinusCircle;
  public faCheck = faCheck;

  constructor(
    public _colorService: ColorService,
    public _configService: ConfigService,
    public _controllerService: ControllerService,
    public _dataService: DataService,
    public _simulationService: SimulationService,
    public _sketchService: SketchService,
  ) { }

  update() {
    this.link = this._dataService.data.connectomes[this.idx];
    var colors = this._colorService.nodes;
    this.colors = {
      pre: colors[this.link.pre % colors.length],
      post: colors[this.link.post % colors.length],
      weight: this.link.syn_spec.weight < 0 ? this._colorService.links.inh : this._colorService.links.exc,
    };
    var connectionConfig = this._configService.config.nest.connection;
    var connRule = this.link.conn_spec ? this.link.conn_spec.rule : 'all_to_all';
    this.slider.connection = connectionConfig[connRule]['options'] || {};
    var synModel = 'model' in this.link.syn_spec ? this.link.syn_spec.model : "static_synapse";
    var modelConfig = this._configService.config.nest.model;
    this.synModel = modelConfig[synModel]
    this.slider.synapse = this.synModel['options'] || {};
  }

  ngOnInit() {
    this.update()
  }

  ngOnChanges() {
    this.update()
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

  onChange(ref, id, value, defaultValue) {
    ref[id] = value;
    this.update()
    this._sketchService.update.emit()
    this._dataService.history(this._dataService.data)
    this._simulationService.run()
  }
}
