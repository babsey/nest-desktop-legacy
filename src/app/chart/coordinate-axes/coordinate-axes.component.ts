import { Component, OnInit, OnChanges, Input, ElementRef, Output, EventEmitter, OnDestroy } from '@angular/core';

import * as d3 from 'd3';

import { ChartService } from '../chart.service';


@Component({
  selector: 'app-coordinate-axes',
  templateUrl: './coordinate-axes.component.html',
  styleUrls: ['./coordinate-axes.component.css']
})
export class CoordinateAxesComponent implements OnInit, OnChanges, OnDestroy {
  @Input() height: number = 0;
  @Input() width: number = 0;
  @Input() idx: number = 0;
  @Input() n: number = 1;
  @Input() xAxis: d3.axisBottom;
  @Input() xDomain: number[];
  @Input() xLabel: string = '';
  @Input() xScale: d3.scaleLinear;
  @Input() yAutoscale: boolean = true;
  @Input() yAxis: d3.axisLeft;
  @Input() yDomain: number[];
  @Input() yLabel: string = '';
  @Input() yScale: d3.scaleLinear;
  @Input() margin: any = {
    top: 0, right: 0, bottom: 0, left: 0
  };
  @Output() change = new EventEmitter();
  private selector: d3.Selection;
  private subscription: any;
  public pos: string = '';
  private scales: any = {};
  public zoomDirection = 'both';

  constructor(
    public _chartService: ChartService,
    private elementRef: ElementRef,
  ) {
    this.selector = d3.select(elementRef.nativeElement);
    this.xScale = this.xScale || this._chartService.xScale;
  }

  ngOnInit() {
    // console.log('Init coordinate axes')

    this.selector.select('.overlay')
      .call(this.drag())
      .call(this.zoom())

    this.selector.select('.overlayFocus')
      .on('mousemove', this.handleMousemove())
      .on('mouseleave', this.handleMouseleave())
      .call(this.drag())
      .call(this.zoom())

    this.selector.select('.overlay--x')
      .call(this.dragX())
      .call(this.zoomX())

    this.selector.select('.overlay--y')
      .call(this.dragY())
      .call(this.zoomY())

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
    let axisWidth = this.width - this.margin.left - this.margin.right;
    let axisHeight = this.yScale.range()[0];

    let height = this.height - this.margin.top - this.margin.bottom;
    let lineHeight = this.n == 1 ? axisHeight : (height - axisHeight) / (this.n - 1);

    this.xScale.range([0, axisWidth])
    this.xAxis.scale(this.xScale)

    this.scales = {
      x: d3.scaleLinear().range([0, axisWidth]).domain(this.xDomain),
      y: d3.scaleLinear().range([lineHeight, 0]).domain(this.yDomain),
    };

    this.selector.select('.focus').attr('transform', 'translate(0,' + ((height - axisHeight) - (this.idx) * lineHeight) + ')')

    this.selector.select('.overlay')
      .attr('width', axisWidth)
      .attr('height', height);

    this.selector.select('.overlayFocus')
      .attr('height', axisHeight + 'px')
      .attr('width', axisWidth + 'px')

    this.selector.select('.overlay--x')
      .attr('transform', 'translate(0,' + height + ')')
      .attr('height', this.margin.bottom + 'px')
      .attr('width', axisWidth + 'px')

    this.selector.select('.overlay--y')
      .attr('transform', 'translate(-30,0)')
      .attr('height', axisHeight + 'px')
      .attr('width', '30px')

    this.selector.select('.axis--x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(this.xAxis)
      .select(".domain").remove();

    this.selector.select('.axis--y')
      .call(this.yAxis)
      .select(".domain").remove();

    this.selector.select('.label--x')
      .attr('text-anchor', 'middle')
      .attr('x', axisWidth / 2)
      .attr('y', height + 26)
      .text(this.xLabel);

    this.selector.select('.label--y')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('x', -2)
      .attr('dy', '.71em')
      .attr('text-anchor', 'end')
      .text(this.yLabel)
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

  zoom() {
    let axisWidth = this.xScale.range()[1];
    let axisHeight = this.yScale.range()[0];
    return d3.zoom()
      .scaleExtent([0.001, 1000])
      .translateExtent([[0, 0], [axisWidth, axisHeight]])
      .extent([[0, 0], [axisWidth, axisHeight]])
      .on('zoom', () => {
        if (this.zoomDirection == 'both' || this.zoomDirection == 'abscissa') {
          this.handleZoomX()
        }
        if (this.zoomDirection == 'both' || this.zoomDirection == 'ordinate') {
          this.handleZoomY()
        }
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
      .scaleExtent([0.001, 1000])
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
      .scaleExtent([0.001, 1000])
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

  handleDragX() {
    // console.log('Handle drag x')
    let xDomain = this.xScale.domain();
    let xRange = this.xScale.range();
    let dxDomain = xDomain[1] - xDomain[0];
    let dx = d3.event.dx * dxDomain / (xRange[1] - xRange[0]);
    this.xScale.domain([xDomain[0] - dx, xDomain[1] - dx])
    this.selector.select('.axis--x').call(this.xAxis.scale(this.xScale)).select(".domain").remove();
    this._chartService.xAutoscale = false;
  }

  handleDragY() {
    // console.log('Handle drag y')
    let yDomain = this.yScale.domain();
    let yRange = this.yScale.range();
    let dyDomain = yDomain[1] - yDomain[0];
    let dy = d3.event.dy * dyDomain / (yRange[1] - yRange[0]);
    this.yScale.domain([yDomain[0] - dy, yDomain[1] - dy])
    this.selector.select('.axis--y').call(this.yAxis.scale(this.yScale)).select(".domain").remove();
    this.yAutoscale = false;
    this._chartService.yAutoscale = false;
  }

  handleZoomX() {
    // console.log('Handle zoom x')
    let xScale = d3.event.transform.rescaleX(this.scales.x);
    this.xScale.domain(xScale.domain())
    this.selector.select('.axis--x').call(this.xAxis.scale(this.xScale)).select(".domain").remove();
    this._chartService.xAutoscale = false;
  }

  handleZoomY() {
    // console.log('Handle zoom y')
    let yScale = d3.event.transform.rescaleY(this.scales.y);
    this.yScale.domain(yScale.domain())
    this.selector.select('.axis--y').call(this.yAxis.scale(this.yScale)).select(".domain").remove();
    this._chartService.yAutoscale = false;
    this.yAutoscale = false;
  }

  rescale() {
    // console.log('Rescale')
    this.rescaleX()
    this.rescaleY(!this.yAutoscale)
  }

  rescaleX(autoscale = true) {
    // console.log('Rescale x')
    this.xScale.domain(this.xDomain)
    this.selector.select('.overlay--x').call(this.zoomX().transform, d3.zoomIdentity.scale(1));
    this._chartService.xAutoscale = autoscale;
  }

  rescaleY(autoscale = true) {
    // console.log('Rescale y')
    this.yScale.domain(this.yDomain)
    this.selector.select('.overlay--y').call(this.zoomY().transform, d3.zoomIdentity.scale(1));
    this.yAutoscale = autoscale;
    this._chartService.yAutoscale = autoscale;
    this.change.emit({
      yAutoscale: this.yAutoscale,
    })
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
      _this.pos = '';
    }
  }

}
