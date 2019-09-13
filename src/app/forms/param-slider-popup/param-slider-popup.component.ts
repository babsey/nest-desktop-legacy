import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import * as math from 'mathjs';
import { MatDialog } from '@angular/material';

import { FormsConfigDialogComponent } from '../forms-config-dialog/forms-config-dialog.component';

import { DistributionService } from '../../services/distribution/distribution.service';

@Component({
  selector: 'app-param-slider-popup',
  templateUrl: './param-slider-popup.component.html',
  styleUrls: ['./param-slider-popup.component.scss']
})
export class ParamSliderPopupComponent implements OnInit {
  @Input() id: string = '';
  @Input() model: string = '';
  @Input() options: any = {};
  @Input() value: any;
  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  public showSlider: boolean = false;
  public data: any[] = [];
  public layout: any = {};
  public config: any = {
    staticPlot: true
  };
  public showPlot: boolean = false;
  public functionType: string = 'pdf';

  public parameterTypes: any[] = [{
    name: 'Constant',
    options: [
      { value: 'constant', label: 'constant', specs: ['value'] },
    ]
  }, {
    name: 'Distance',
    options: [
      { value: 'linear', label: 'linear', specs: ['a', 'c'] },
      { value: 'exponential', label: 'exponential', specs: ['a', 'c', 'tau'] },
      { value: 'gaussian', label: 'gaussian', specs: ['p_center', 'mean', 'sigma', 'c'] },
      { value: 'gamma', label: 'gamma', specs: ['kappa', 'theta'] },
      { value: 'gaussian2D', label: 'gaussian 2D', specs: ['p_center', 'mean_x', 'mean_y', 'sigma_x', 'sigma_y', 'rho', 'c'] },
    ]
  }, {
    name: 'Value',
    options: [
      { value: 'uniform', label: 'uniform', specs: ['min', 'max'] },
      { value: 'normal', label: 'normal', specs: ['mean', 'sigma', 'min', 'max'] },
      { value: 'lognormal', label: 'log normal', specs: ['mu', 'sigma', 'min', 'max'] },
    ]
  }];
  public paramSpecs = require('../param-config/params.json');
  public selectedParameterType = this.findParameterType('constant');

  constructor(
    private dialog: MatDialog,
    private _distributionService: DistributionService,
  ) {
  }

  ngOnInit() {
    if (this.isObject(this.value)) {
      this.selectedParameterType = this.findParameterType(this.value.parametertype);
    }
    this.plot()
  }

  flatten(ary) { return ary.reduce((a, b) => a.concat(Array.isArray(b) ? this.flatten(b) : b), []) }

  findParameterType(parametertype) {
    var parameterTypes = this.parameterTypes.map(group => group.options);
    parameterTypes = this.flatten(parameterTypes);
    return parameterTypes.find(p => p.value == parametertype);
  }

  isObject(value) {
    return typeof value === 'object';
  }

  selectFunctionType(ftype) {
    this.functionType = ftype;
    this.plot();
  }

  cumsum(d) {
    var new_array = [];
    d.reduce(function(a, b, i) { return new_array[i] = a + b; }, 0);
    return new_array;
  }

  plot() {
    this.data = [];
    this.layout['title'] = '';
    if (this.value == undefined) return
    var value = this.value;
    if (!this._distributionService.pdf.hasOwnProperty(value.parametertype)) return

    var dx = 0.001;
    var xmin: any = 0;
    var xmax: any = 1.;
    if (['uniform', 'normal', 'lognormal'].includes(value.parametertype)) {
      xmin = value.specs.min;
      xmax = value.specs.max;
    }
    var x: any;
    var y: any;
    var z: any;

    if (value.parametertype == 'gaussian2D') {
      x = math.range(-.5, .5, .02);
      y = math.range(-.5, .5, .02);
      z = this._distributionService.pdf[value.parametertype](x._data, y._data, value.specs);
      this.data = [{
        type: 'heatmap',
        // type: 'contours',
        x: x._data,
        y: y._data,
        z: z,
        // line: {
        //   smoothing: 0.85
        // },
        colorscale: 'Blues', // 'Greys'
        reversescale: true,
        // autocontour: false,
        // contours: {
        //   start: 0.1,
        //   end: 0.9,
        //   size: .2
        // }
        colorbar: {
          title: 'pdf'
        }
      }];
      this.layout['title'] = 'pdf of ' + this.selectedParameterType.label + ' distribution';
    } else {
      x = math.range(xmin, xmax, dx);
      y = this._distributionService.pdf[value.parametertype](x._data, value.specs);
      if (this.functionType == 'cdf') { // || ['uniform', 'normal', 'lognormal'].includes(value.parametertype)) {
        var ysum = math.sum(y);
        y = y.map(yi => yi / ysum);
        y = this.cumsum(y);
      }
      this.data = [{
        fill: 'tozeroy',
        type: 'scatter',
        x: x._data,
        y: y,
      }];
      this.layout['title'] = this.functionType + ' of ' + this.selectedParameterType.label + ' distribution';
    }
    this.layout['xaxis'] = {
      title: ['uniform', 'normal', 'lognormal'].includes(value.parametertype) ? 'value' : 'distance x',
    };
    this.layout['yaxis'] = {
      title: value.parametertype == 'gaussian2D' ? 'distance y' : this.functionType,
    };
  }

  onSelectedChange(event) {
    this.value = { parametertype: event, specs: {} };
    this.selectedParameterType = this.findParameterType(this.value.parametertype);
    this.selectedParameterType.specs.map(spec => this.value.specs[spec] = this.paramSpecs[spec].value || 0.);
    this.plot();
    this.valueChange.emit(this.value);
  }

  onValueChange(spec, event) {
    this.value.specs[spec] = event;
    this.plot()
    this.valueChange.emit(this.value);
  }

  setDefaultValue() {
    this.value = Number(this.options.value);
    this.valueChange.emit(this.value);
  }

  openConfigDialog() {
    if (this.id && this.model) {
      this.dialog.open(FormsConfigDialogComponent, {
        data: {
          id: this.id,
          model: this.model,
        }
      });
    }
  }
}
