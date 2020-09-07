import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import * as math from 'mathjs';
import { MatDialog } from '@angular/material/dialog';

import { Config } from '../../../components/config';

import { DistributionService } from '../../../services/distribution/distribution.service';

@Component({
  selector: 'app-param-random',
  templateUrl: './param-random.component.html',
  styleUrls: ['./param-random.component.scss']
})
export class ParamRandomComponent implements OnInit {
  @Input() options: any = {};
  @Input() value: any;
  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  private _config: Config;
  private _functionType: string;
  private _parameterTypes: any[];
  private _plot: any;
  private _selectedParameterType: any;

  constructor(
    private _dialog: MatDialog,
    private _distributionService: DistributionService,
  ) {
    this._config = new Config('ParameterRandom');
    this._functionType = 'pdf';
    this._parameterTypes = [
      {
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
      }
    ];
    this._plot = {
      show: false,
      data: [],
      layout: {},
      config: {
        staticPlot: true,
      }
    };
    this._selectedParameterType = this.findParameterType('constant')
  }

  ngOnInit() {
    if (this.isObject(this.value)) {
      this._selectedParameterType = this.findParameterType(this.value.parameterType);
    }
    this.plotting();
  }

  get config(): any {
    return this._config.config;
  }

  get functionType(): string {
    return this._functionType;
  }

  get parameterTypes(): any[] {
    return this._parameterTypes;
  }

  get plot(): any {
    return this._plot;
  }

  get selectedParameterType(): any {
    return this._selectedParameterType;
  }

  flatten(values: any): any {
    return values.reduce(
      (a: any, b: any) => a.concat(Array.isArray(b) ? this.flatten(b) : b), [])
  }

  findParameterType(parameterType: any): any {
    let parameterTypes: any = this._parameterTypes.map(group => group.options);
    parameterTypes = this.flatten(parameterTypes);
    return parameterTypes.find(p => p.value === parameterType);
  }

  isObject(value: any): boolean {
    return typeof value === 'object';
  }

  paramSpecs(spec: string): any {
    return this.config[spec];
  }

  selectFunctionType(ftype: string): void {
    this._functionType = ftype;
    this.plot();
  }

  cumsum(d: number[]): number[] {
    const newArray: number[] = [];
    d.reduce(function(a, b, i) { return newArray[i] = a + b; }, 0);
    return newArray;
  }

  plotting(): void {
    this.plot.data = [];
    this.plot.layout['title'] = '';
    if (this.value === undefined) return
    var value = this.value;
    if (!this._distributionService.pdf.hasOwnProperty(value.parameterType)) return

    var dx = 0.001;
    var xmin: any = 0;
    var xmax: any = 1.;
    if (['uniform', 'normal', 'lognormal'].includes(value.parameterType)) {
      xmin = value.specs.min;
      xmax = value.specs.max;
    }
    var x: any;
    var y: any;
    var z: any;

    if (value.parameterType === 'gaussian2D') {
      x = math.range(-.5, .5, .01);
      y = math.range(-.5, .5, .01);
      z = this._distributionService.pdf[value.parameterType](x._data, y._data, value.specs);
      this.plot.data = [{
        type: 'contour', //'heatmap',
        x: x._data,
        y: y._data,
        z: z,
        line: {
          smoothing: 0.85
        },
        // colorscale: 'Gray',
        // reversescale: true,
        autocontour: false,
        contours: {
          coloring: 'heatmap',
        },
        colorbar: {
          title: 'PDF'
        }
      }];
      this.plot.layout['title'] = this.selectedParameterType.label + ' distribution';
    } else {
      x = math.range(xmin, xmax, dx);
      y = this._distributionService.pdf[value.parameterType](x._data, value.specs);
      if (this.functionType === 'cdf') { // || ['uniform', 'normal', 'lognormal'].includes(value.parameterType)) {
        var ysum = math.sum(y);
        y = y.map(yi => yi / ysum);
        y = this.cumsum(y);
      }
      this.plot.data = [{
        fill: 'tozeroy',
        type: 'scatter',
        x: x._data,
        y: y,
      }];
      this.plot.layout['title'] = this.functionType + ' of ' + this.selectedParameterType.label + ' distribution';
    }
    this.plot.layout['xaxis'] = {
      title: ['uniform', 'normal', 'lognormal'].includes(value.parameterType) ? 'value' : 'distance',
    };
    this.plot.layout['yaxis'] = {
      title: value.parameterType === 'gaussian2D' ? 'y' : 'value',
    };
  }

  onSelectedChange(event: any): void {
    this.value = { parameterType: event, specs: {} };
    this._selectedParameterType = this.findParameterType(this.value.parameterType);
    this.selectedParameterType.specs.forEach((spec: string) => {
      this.value.specs[spec] = this.paramSpecs(spec).value || 0.
    });
    this.plotting();
    this.valueChange.emit(this.value);
  }

  onValueChange(value: any): void {
    this.plotting()
    this.valueChange.emit(this.value);
  }

  setDefaultValue(): void {
    this.value = Number(this.options.value);
    this.valueChange.emit(this.value);
  }
}
