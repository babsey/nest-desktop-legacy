import { Component, Input, OnInit, OnChanges } from '@angular/core';

import { DataService } from '../shared/services/data/data.service';
import { ControllerService } from '../shared/services/controller/controller.service';
import { SketchService } from '../shared/services/sketch/sketch.service';
import { ConfigService } from '../shared/services/config/config.service';

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
  public services: any;
  public options: any;

  public faLongArrowAltRight = faLongArrowAltRight;
  public faEllipsisV = faEllipsisV;
  public faCrosshairs = faCrosshairs;
  public faEraser = faEraser;
  public faBan = faBan;
  public faMinusCircle = faMinusCircle;
  public faCheck = faCheck;

  constructor(
    public _dataService: DataService,
    public _controllerService: ControllerService,
    public _sketchService: SketchService,
    public _configService: ConfigService,
  ) { }

  update() {
    this.link = this._dataService.data.connectomes[this.idx];
    var colors = this._sketchService.options.nodes.colors;
    this.colors = {
      pre: colors[this.link.pre % colors.length],
      post: colors[this.link.post % colors.length],
      weight: this.link.syn_spec.weight < 0 ? this._sketchService.options.links.inh : this._sketchService.options.links.exc,
    };
    var connectionConfig = this._configService.config.nest.connection;
    var connRule = this.link.conn_spec ? this.link.conn_spec.rule : 'all_to_all';
    this.slider.connection = connectionConfig[connRule]['options'] || {};
    var modelConfig = this._configService.config.nest.model;
    var synModel = 'model' in this.link.syn_spec ? this.link.syn_spec.model : "static_synapse";
    this.slider.synapse = modelConfig[synModel]['options'] || {};
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

  selectConnRule(link, rule) {
    link.conn_spec = {}
    link.conn_spec.rule = rule;
    var options = this._configService.config.nest.connection[rule].options;
    for (var key in options) {
      link.conn_spec[key] = options[key].value;
    }
    this.update()
  }

  selectSynModel(link, model) {
    link.syn_spec.model = model;
    link.syn_spec.params = {};
    this.update()
  }

}
