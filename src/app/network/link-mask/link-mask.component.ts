import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { NetworkConfigService } from '../network-config/network-config.service';

@Component({
  selector: 'app-link-mask',
  templateUrl: './link-mask.component.html',
  styleUrls: ['./link-mask.component.scss']
})
export class LinkMaskComponent implements OnInit {
  @Input() link: any = {};
  @Input() connectome: any = {};
  @Output() maskChange: EventEmitter<any> = new EventEmitter();
  public data: any[] = [];
  public layout: any = {};
  public maskOptions: any = [
    { value: 'none', label: 'none' },
    { value: 'rectangular', label: 'rectangular' },
    { value: 'circular', label: 'circular' },
    { value: 'doughnut', label: 'doughnut' },
    { value: 'elliptical', label: 'elliptical' }
  ];
  public selectedMaskConfig: any;
  public showPlot: boolean = false;


  constructor(
    public _networkConfigService: NetworkConfigService,
  ) { }

  ngOnInit() {
    this.layout['xaxis'] = { range: [-.55, .55] }
    this.layout['yaxis'] = { range: [-.55, .55] }
    this.selectMaskConfig();
    setTimeout(() => this.draw(), 100)
  }

  update() {
    if (!this.connectome.hasOwnProperty('projections')) return
  }

  selectMask(value) {
    if (value == 'none') {
      delete this.connectome.projections['mask'];
    } else {
      this.connectome.projections['mask'] = {
        masktype: value,
        specs: {}
      };
      this.selectMaskConfig()
      this.selectedMaskConfig.specs.map(spec => {
        this.connectome.projections['mask'].specs[spec.id] = spec.value;
      })
    }
    this.draw()
  }

  selectMaskConfig() {
    var selectedMask = this.connectome.projections.hasOwnProperty('mask') ? this.connectome.projections.mask['masktype'] : 'none';
    this.selectedMaskConfig = this._networkConfigService.config.mask[selectedMask];
  }

  onMaskChange(spec, value) {
    this.connectome.projections.mask.specs[spec] = value;
    this.draw()
    this.maskChange.emit()
  }

  draw() {
    this.layout['shapes'] = [];
    if (!this.connectome.projections.mask) return
    switch (this.connectome.projections.mask.masktype) {
      case 'rectangular':
        this.drawRect();
        break;
      case 'circular':
        this.drawCircle();
        break;
      case 'doughnut':
        this.drawDoughnut();
        break;
      case 'elliptical':
        this.drawEllipsis();
        break;
    }
  }

  drawRect() {
    var specs = this.connectome.projections.mask.specs;
    this.layout['shapes'] = [{
      type: 'rect',
      xref: 'x',
      yref: 'y',
      x0: specs.lower_left[0],
      y0: specs.lower_left[1],
      x1: specs.upper_right[0],
      y1: specs.upper_right[1],
      opacity: 0.2,
      fillcolor: 'blue',
      line: {
        color: 'blue',
      }
    }]
  }

  drawCircle() {
    var specs = this.connectome.projections.mask.specs;
    this.layout['shapes'] = [{
      type: 'circle',
      xref: 'x',
      yref: 'y',
      x0: -1 * specs.radius,
      y0: -1 * specs.radius,
      x1: specs.radius,
      y1: specs.radius,
      opacity: 0.2,
      fillcolor: 'blue',
      line: {
        color: 'blue',
      }
    }]
  }

  drawDoughnut() {
    var specs = this.connectome.projections.mask.specs;
    this.layout['shapes'] = [{
      type: 'circle',
      xref: 'x',
      yref: 'y',
      x0: -1 * specs.outer_radius,
      y0: -1 * specs.outer_radius,
      x1: specs.outer_radius,
      y1: specs.outer_radius,
      opacity: 0.2,
      fillcolor: 'blue',
      line: {
        color: 'blue',
      }
    }, {
      type: 'circle',
      xref: 'x',
      yref: 'y',
      x0: -1 * specs.inner_radius,
      y0: -1 * specs.inner_radius,
      x1: specs.inner_radius,
      y1: specs.inner_radius,
      opacity: 1.,
      fillcolor: 'white',
      line: {
        color: 'white',
      }
    // }, {
    //   type: 'line',
    //   xref: 'x',
    //   yref: 'y',
    //   x0: -1 * specs.inner_radius,
    //   y0: 0,
    //   x1: specs.inner_radius,
    //   y1: 0,
    //   line: {
    //     width: 1,
    //     color: 'black',
    //   }
    // }, {
    //   type: 'line',
    //   xref: 'x',
    //   yref: 'y',
    //   x0: 0,
    //   y0: -1 * specs.inner_radius,
    //   x1: 0,
    //   y1: specs.inner_radius,
    //   line: {
    //     width: 1,
    //     color: 'black',
    //   }
    }]
  }

  drawEllipsis() {
    var specs = this.connectome.projections.mask.specs;
    this.layout['shapes'] = [{
      type: 'circle',
      xref: 'x',
      yref: 'y',
      x0: -1 * specs.major_axis / 2,
      y0: -1 * specs.minor_axis / 2,
      x1: specs.major_axis / 2,
      y1: specs.minor_axis / 2,
      opacity: 0.2,
      fillcolor: 'blue',
      line: {
        color: 'blue',
      }
    }]
  }


}
