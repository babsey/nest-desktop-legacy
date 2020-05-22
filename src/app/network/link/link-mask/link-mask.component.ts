import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { MatMenuTrigger } from '@angular/material/menu';

import { AppService } from '../../../app.service';
import { NetworkConfigService } from '../../network-config/network-config.service';


@Component({
  selector: 'app-link-mask',
  templateUrl: './link-mask.component.html',
  styleUrls: ['./link-mask.component.scss']
})
export class LinkMaskComponent implements OnInit {
  @Input() projections: any;
  @Output() projectionsChange: EventEmitter<any> = new EventEmitter();
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

  @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };


  constructor(
    private _appService: AppService,
    public _networkConfigService: NetworkConfigService,
  ) { }

  ngOnInit(): void {
    this.layout['xaxis'] = { range: [-.55, .55] }
    this.layout['yaxis'] = { range: [-.55, .55] }
    this.selectMaskConfig();
    setTimeout(() => this.draw(), 100)
  }

  unmask(): void {
    delete this.projections['mask'];
    this.draw()
  }

  selectMask(value: string): void {
    if (value == 'none') {
      delete this.projections['mask'];
    } else {
      this.projections['mask'] = {
        masktype: value,
        specs: {}
      };
      this.selectMaskConfig()
      this.selectedMaskConfig.specs.map(spec => {
        this.projections['mask'].specs[spec.id] = spec.value;
      })
    }
    this.draw()
  }

  selectMaskConfig(): void {
    var selectedMask = this.projections.hasOwnProperty('mask') ? this.projections.mask['masktype'] : 'none';
    this.selectedMaskConfig = this._networkConfigService.config.mask[selectedMask];
  }

  draw(): void {
    this.layout['shapes'] = [];
    if (!this.projections.mask) return
    switch (this.projections.mask.masktype) {
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

  drawRect(): void {
    var specs = this.projections.mask.specs;
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

  drawCircle(): void {
    var specs = this.projections.mask.specs;
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

  drawDoughnut(): void {
    var specs = this.projections.mask.specs;
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

  drawEllipsis(): void {
    var specs = this.projections.mask.specs;
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

  onValueChange(value: number): void {
    this.projectionsChange.emit(this.projections)
    setTimeout(() => this.draw(), 1)
  }

  onMouseOver(even: MouseEvent): void {
    this._appService.rightClick = true;
  }

  onMouseOut(event: MouseEvent): void {
    this._appService.rightClick = false;
  }

  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.openMenu();
  }

}
