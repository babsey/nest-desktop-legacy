import { Component, OnInit, Input, ElementRef, OnDestroy } from '@angular/core';

import * as d3 from 'd3';

import { ColorService } from '../../services/color/color.service';
import { DataService } from '../../services/data/data.service';
import { SketchService } from '../../sketch/sketch.service';

@Component({
  selector: 'g[app-background-sketch]',
  template: '',
  styleUrls: ['./background-sketch.component.css'],
})
export class BackgroundSketchComponent implements OnInit, OnDestroy {
  @Input() data: any;
  @Input() width: number;
  @Input() height: number;
  private selector: d3.Selection;
  private dragline: any;
  private subscription: any;
  private sourceNode: any;

  constructor(
    private _colorService: ColorService,
    private _dataService: DataService,
    private _sketchService: SketchService,
    private elementRef: ElementRef,
  ) {
    this.selector = d3.select(elementRef.nativeElement);
  }

  ngOnInit() {
    if (this.data == {} || !this.data) return
    // console.log('Sketch background init')
    var _this = this;

    var element_types = ['recorder', 'neuron', 'stimulator'];
    var modelDefaults = {
      stimulator: 'dc_generator',
      neuron: 'iaf_psc_alpha',
      recorder: 'voltmeter',
    };

    var background = this.selector.append('svg:rect')
      .attr('class', 'background')
      .style('fill', 'white')
      .attr('width', this.width)
      .attr('height', this.height)

    this.dragline = this.selector.append('svg:path')
      .attr('class', 'link dragline')
      .style('pointer-events', 'none')
      .attr('d', 'M0,0L0,0');

    background
      .on('mousemove', function() {
        var colors = _this._colorService.colors();
        var source = _this._sketchService.events.sourceNode;

        if (source) {
          var point = d3.mouse(this);
          var target = {
            x: point[0],
            y: point[1],
          };
          _this.dragline
            .attr('d', _this._sketchService.drawPath(source.sketch, target))
            .style('stroke', () => colors[source.idx % colors.length])
            .style('marker-start', () => 'url(#hillock_' + colors[source.idx % colors.length] + ')')
            .style('marker-end', () => 'url(#exc_' + colors[source.idx % colors.length] + ')');
        }
      })
      .on('click', function() {
        var data = _this.data;
        if (data == {} || !data) return
        _this.selector.selectAll('.select').remove();
        _this._sketchService.resetMouseVars()
        if (!_this._sketchService.options.drawing) {
          _this._sketchService.options.show = false;
          return
        }
        var point = d3.mouse(this);
        var select = _this.selector.append('svg:g')
          .attr('class', 'select')
          .attr('transform', 'translate(' + point[0] + ',' + point[1] + ')');

        var tooltip = select.append('svg:text')
          .attr('class', 'tooltip')
          .attr('transform', 'translate(0, -45)')
          .style('visibility', 'hidden');

        select.append('svg:circle')
          .attr('r', 16)
          .attr('fill', 'white')
          .on('click', () => {
            _this._sketchService.events.sourceNode = null;
            _this.selector.selectAll('.select').remove()
            _this._sketchService.update.emit();
          })

        var arcFrame = d3.arc()
          .innerRadius(16)
          .outerRadius(40);

        var sourceNode = _this._sketchService.events.sourceNode;
        var colors = _this._colorService.colors();
        element_types.forEach((d, i) => {
          var arc = select.append('svg:path').attr('class', d)
            .datum({
              startAngle: Math.PI * i * 2 / 3,
              endAngle: Math.PI * (i + 1) * 2 / 3,
            })
            .style('fill', 'white')
            .style('stroke', () => colors[data.collections.length % colors.length])
            .style('stroke-width', 2.5)
            .attr('d', arcFrame)
            .on('mouseover', function() {
              tooltip.text(d)
                .style('visibility', 'visible');

              if (!sourceNode || d != 'stimulator') {
                d3.select(this).style('fill', () => colors[data.collections.length % colors.length])
              }
            })
            .on('mouseout', function() {
              tooltip.style('visibility', 'hidden');
              d3.select(this).style('fill', 'white');
            })
            .on('mouseup', () => {
              _this.selector.selectAll('.select').remove();
              var sourceNode = _this._sketchService.events.sourceNode;
              if (!sourceNode || d != 'stimulator') {
                _this._sketchService.resetMouseVars()
                _this._dataService.history(data)
                var element_type = d;
                var idx =  data.collections.length
                var newModel = element_type + '-' + idx;
                data.models[newModel] = {
                  existing: modelDefaults[d],
                  params: {},
                };
                var newNode = {
                  idx: idx,
                  element_type: element_type,
                  model: newModel,
                  sketch: {'x': point[0], 'y': point[1]}
                };
                _this.data.collections.push(newNode);
                if (sourceNode) {
                  var newLink = _this._dataService.newLink();
                  newLink['idx'] = data.connectomes.length;
                  newLink['pre'] = sourceNode.idx;
                  newLink['post'] = newNode['idx'];
                  _this.data.connectomes.push(newLink);
                }
              }
              _this._sketchService.events.sourceNode = null;
              _this._sketchService.update.emit();
            });

          var f = (i * 2 / 3) + (1 / 3);
          select.append('svg:text')
            .attr('class', 'label')
            .attr('fill', (sourceNode && d == 'stimulator') ? '#cccccc' : 'black')
            .attr('dx', Math.sin(Math.PI * f) * 28)
            .attr('dy', -Math.cos(Math.PI * f) * 28 + 5)
            .text(d.slice(0, 1).toUpperCase());
        })
      })

    this.subscription = this._sketchService.update.subscribe(() => this.update())
    this.update()
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  update() {
    if (this.data == {}) return
    this.selector.select('rect.background')
      .attr('width', this.width)
      .attr('height', this.height)

    if (this.sourceNode == null || this._sketchService.events.sourceNode != this.sourceNode) {
      this.dragline.attr('d', 'M0,0L0,0')
        .style('marker-start', '')
        .style('marker-end', '');
    }
    this.sourceNode = this._sketchService.events.sourceNode;

    if (!this._sketchService.options.drawing) {
      this.selector.selectAll('.select').remove();
    }

  }

}
