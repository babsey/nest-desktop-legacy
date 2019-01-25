import { Component, OnInit, OnChanges, Input, ElementRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import * as d3 from 'd3';

import { ChartService } from '../chart.service';


@Component({
  selector: 'app-coordinate-axes',
  templateUrl: './coordinate-axes.component.html',
  styleUrls: ['./coordinate-axes.component.css']
})
export class CoordinateAxesComponent implements OnInit, OnChanges, OnDestroy {
  @Input() autofocus: any = false;
  @Input() height: any;
  @Input() n: any = 1;
  @Input() xAxis: any;
  @Input() xDomain: any;
  @Input() xLabel: any = '';
  @Input() xScale: any;
  @Input() yAutoscale: any;
  @Input() yAxis: any;
  @Input() yDomain: any;
  @Input() yLabel: any = '';
  @Input() yScale: any;
  @Output() change = new EventEmitter();
  private selector: d3.Selection;
  private subscription: any;
  public pos: any;
  private idx: any = 0;

  constructor(
    public _chartService: ChartService,
    private elementRef: ElementRef,
  ) {
    this.selector = d3.select(elementRef.nativeElement);
  }

  ngOnInit() {
    // console.log('Init coordinate axes')

    this.selector.select('svg').on('mousemove', this.handleFocus())

    this.selector.select('.overlay')
      .on('mousemove', () => this.handleMousemove())
      .on('mouseleave', this.handleMouseleave())
      .call(this.drag())
      .call(this.zoom());

    this.selector.select('.overlay--x')
      .call(this.dragX())
      .call(this.zoomX())
      .on('dblclick.zoom', () => {
        // console.log('Double click event overlay x')
        this.autoscaleX()
        this._chartService.update.emit()
      });

    this.selector.select('.overlay--y')
      .call(this.dragY())
      .call(this.zoomY())
      .on('dblclick.zoom', () => {
        // console.log('Double click event overlay y')
        // this.yScale.domain(this.yDomain)
        this.autoscaleY()
        this._chartService.update.emit()
      });

    this.subscription = this._chartService.update.subscribe(() => this.update())
  }

  ngOnDestroy() {
    // console.log('Destroy coordinate axes')
    this.subscription.unsubscribe()
  }

  ngOnChanges() {
    // console.log('Change coordinate axes')
    this.update()
  }

  update() {
    // console.log('Update coordinate axes')
    let xScale = this.xScale || this._chartService.xScale;

    let margin = this._chartService.g;
    let axisWidth = this.xScale.range()[1];
    let axisHeight = this.yScale.range()[0];

    let height = this.height - margin.top - margin.bottom;

    // this.selector.select('.brush')
    //   .attr('width', width)
    //   .attr('height', height);

    this.focusTransform()

    this.selector.select('.overlay')
      .attr('width', axisWidth)
      .attr('height', height);

    this.selector.select('.overlay--x')
      .attr('transform', 'translate(0,' + height + ')')
      .attr('height', margin.bottom + 'px')
      .attr('width', axisWidth + 'px')

    this.selector.select('.overlay--y')
      .attr('transform', 'translate(-30,0)')
      .attr('height', axisHeight + 'px')
      .attr('width', '30px')

    this.selector.select('.axis--x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(this.xAxis);

    this.selector.select('.axis--y')
      .call(this.yAxis);

    this.selector.select('.label--x')
      .attr('text-anchor', 'middle')
      .attr('x', axisWidth / 2)
      .attr('y', height + 28)
      .text(this.xLabel);

    this.selector.select('.label--y')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .attr('text-anchor', 'end')
      .text(this.yLabel)
  }

  dragX() {
    return d3.drag()
      .on('drag', () => {
        this.handleDragX()
        this.change.emit({
          xAutoscale: this._chartService.xAutoscale,
        })
      })
  }

  dragY() {
    let axisHeight: any;
    return d3.drag()
      .on('drag', () => {
        this.handleDragY()
        this.change.emit({
          yAutoscale: this.yAutoscale,
          yScale: this.yScale,
        })
      })
  }

  drag() {
    return d3.drag()
      .on('drag', () => {
        this.handleDragX()
        this.handleDragY()
        this.change.emit({
          xAutoscale: this._chartService.xAutoscale,
          yAutoscale: this.yAutoscale,
          yScale: this.yScale,
        })
      })
  }

  zoomX() {
    let axisWidth = this.xScale.range()[1];
    let axisHeight = this.yScale.range()[0];
    return d3.zoom()
      .scaleExtent([0.5, 2])
      .translateExtent([[0, 0], [axisWidth, axisHeight]])
      .extent([[0, 0], [axisWidth, axisHeight]])
      .on('zoom', () => {
        this.handleZoomX()
        this.change.emit({
          xAutoscale: this._chartService.xAutoscale,
        })
      })
  }

  zoomY() {
    let axisWidth = this.xScale.range()[1];
    let axisHeight = this.yScale.range()[0];
    return d3.zoom()
      .scaleExtent([0.5, 2])
      .translateExtent([[0, 0], [axisWidth, axisHeight]])
      .extent([[0, 0], [axisWidth, axisHeight]])
      .on('zoom', () => {
        this.handleZoomY()
        this.change.emit({
          yAutoscale: this.yAutoscale,
          yScale: this.yScale,
        })
      })
  }

  zoom() {
    let axisWidth = this.xScale.range()[1];
    let axisHeight = this.yScale.range()[0];
    return d3.zoom()
      .scaleExtent([0.5, 2])
      .translateExtent([[0, 0], [axisWidth, axisHeight]])
      .extent([[0, 0], [axisWidth, axisHeight]])
      .on('zoom', () => {
        this.handleZoomX()
        this.handleZoomY()
        this.change.emit({
          xAutoscale: this._chartService.xAutoscale,
          yAutoscale: this.yAutoscale,
          yScale: this.yScale,
        })
      })
  }

  handleDragX() {
    // console.log('Handle drag x')
    let xDomain = this.xScale.domain();
    let xRange = this.xScale.range();
    let dxDomain = xDomain[1] - xDomain[0];
    let dx = d3.event.dx * dxDomain / (xRange[1] - xRange[0]);
    this.xScale.domain([xDomain[0] - dx, xDomain[1] - dx])
    this.selector.select(".axis--x").call(this.xAxis.scale(this.xScale));
    this._chartService.xAutoscale = false;
  }

  handleDragY() {
    // console.log('Handle drag y')
    let yDomain = this.yScale.domain();
    let yRange = this.yScale.range();
    let dyDomain = yDomain[1] - yDomain[0];
    let dy = d3.event.dy * dyDomain / (yRange[1] - yRange[0]);
    this.yScale.domain([yDomain[0] - dy, yDomain[1] - dy])
    this.selector.select(".axis--y").call(this.yAxis.scale(this.yScale));
    this.yAutoscale = false;
    this._chartService.yAutoscale = false;
  }

  handleZoomX() {
    // console.log('Handle zoom x')
    let xScale = d3.event.transform.rescaleX(this.xScale);
    this.xScale.domain(xScale.domain())
    this.selector.select(".axis--x").call(this.xAxis.scale(this.xScale));
    this._chartService.xAutoscale = false;
  }

  handleZoomY() {
    // console.log('Handle zoom y')
    let yScale = d3.event.transform.rescaleY(this.yScale);
    this.yScale.domain(yScale.domain())
    this.selector.select(".axis--y").call(this.yAxis.scale(this.yScale));
    this.yAutoscale = false;
  }

  autoscale() {
    // console.log('Autoscale')
    // this._chartService.yAutoscale = true;
    this.selector.select('.overlay').call(this.zoomX().transform, d3.zoomIdentity.scale(1));
    this.autoscaleX()
    this.autoscaleY()
    this._chartService.yAutoscale = true;
    this.change.emit({
      yAutoscale: this.yAutoscale,
    })
  }

  autoscaleX() {
    // console.log('Autoscale x')
    this.xScale.domain(this.xDomain)
    this.selector.select('.overlay--x').call(this.zoomX().transform, d3.zoomIdentity.scale(1));
    this._chartService.xAutoscale = true;
  }

  autoscaleY() {
    // console.log('Autoscale y')
    this.yScale.domain(this.yDomain)
    this.selector.select('.overlay--y').call(this.zoomY().transform, d3.zoomIdentity.scale(1));
    this.yAutoscale = true;
  }

  handleMousemove() {
    let _this = this;
    return function() {
      let m = d3.mouse(this);
      let x = _this.xScale.invert(m[0]);
      let y = _this.yScale.invert(m[1]);
      _this.pos = 'x: ' + x.toFixed(1) + ' y: ' + y.toFixed(1);
    }
  }

  handleMouseleave() {
    let _this = this;
    return function() {
      _this.pos = [];
    }
  }

  handleFocus() {
    let _this = this;
    return function() {
      if (_this.n == 1 || !_this.autofocus) return
      let m = d3.mouse(this);
      let y = m[1];
      let margin = _this._chartService.g;
      let height = _this.height - margin.top - margin.bottom;
      if (y >= height) return
      let axisHeight = _this.yScale.range()[0];
      let lineHeight = (height - axisHeight) / _this.n;
      _this.idx = y <= axisHeight ? 0 : Math.floor((y - axisHeight) / lineHeight);
      _this.focusTransform()
    }
  }

  focusTransform() {
    let axisHeight = this.yScale.range()[0];
    let margin = this._chartService.g;
    let height = this.height - margin.top - margin.bottom;

    let lineHeight = this.n == 1 ? axisHeight : (height - axisHeight) / (this.n - 1);
    // let lineHeight = (height - axisHeight * axisHeight / height) / this.n;
    this.selector.select('.focus').attr('transform', 'translate(0,' + (this.idx) * lineHeight + ')')
    this.change.emit({
      idx: this.idx,
    })
  }
}
