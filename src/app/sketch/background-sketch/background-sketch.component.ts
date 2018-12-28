import {
  Component,
  OnInit,
  Input,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import * as d3 from 'd3';

import { ColorService } from '../../services/color/color.service';
import { ControllerService } from '../../controller/controller.service';
import { DataService } from '../../services/data/data.service';
import { SketchService } from '../../sketch/sketch.service';

@Component({
  selector: 'g[app-background-sketch]',
  template: '',
  styleUrls: ['./background-sketch.component.css'],
})
export class BackgroundSketchComponent implements OnInit, OnDestroy {
  @Input() data: any;
  @Input() width: any;
  @Input() height: any;
  private selector: d3.Selection;
  private dragline: any;
  private subscription: any;

  constructor(
    private _colorService: ColorService,
    private _controllerService: ControllerService,
    private _dataService: DataService,
    private _sketchService: SketchService,
    private elementRef: ElementRef,
  ) {
    this.selector = d3.select(elementRef.nativeElement);
  }

  addCollection(idx, point) {
    this._dataService.records = [];
    return {
      idx: idx,
      element_type: '',
      model: '',
      params: {},
      sketch: {
        x: point[0],
        y: point[1],
      }
    }
  }

  addConnectome(idx, pre, post) {
    this._dataService.records = [];
    return {
      idx: idx,
      pre: pre,
      post: post,
      conn_spec: {
        rule: 'all_to_all',
      },
      syn_spec: {
        model: 'static_synapse',
        weight: 1.0,
      },
    }
  }

  update() {
    if (this.data == {}) return
    this.selector.select('rect.background')
      .attr('width', this.width)
      .attr('height', this.height)

    if (!this._sketchService.events.sourceNode) {
      this.dragline.attr('d', 'M0,0L0,0')
        .style('marker-end', '');
    }

    if (!this._controllerService.options.edit) {
      this.selector.selectAll('.select').remove();
    }

  }

  ngOnInit() {
    if (this.data == {} || !this.data) return
    // console.log('Sketch background init')
    var _this = this;
    var colors = this._colorService.nodes;

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
      .style('stroke', 'steelblue')
      .style('stroke-width', '5px')
      .attr('d', 'M0,0L0,0');

    background
      .on('mousemove', function() {
        var source = _this._sketchService.events.sourceNode;
        if (source) {
          var point = d3.mouse(this);
          var target = {
            x: point[0],
            y: point[1],
          };
          _this.dragline
            .attr('d', _this._sketchService.drawPath(source.sketch, target))
            .style('marker-end', 'url(#end-arrow)');
        }
      })
      .on('click', function() {
        var data = _this.data;
        if (data == {} || !data) return
        _this.selector.selectAll('.select').remove();
        _this._sketchService.resetMouseVars()
        if (!_this._controllerService.options.edit) {
          _this._sketchService.options.show = false;
          return
        }
        var point = d3.mouse(this);
        var select = _this.selector.append('svg:g')
          .attr('class', 'select')
          .attr('transform', 'translate(' + point[0] + ',' + point[1] + ')');

        var tooltip = select.append('svg:text')
          .attr('class', 'tooltip')
          .attr('transform', 'translate(0, -65)')
          .style('visibility', 'hidden');

        select.append('svg:circle')
          .attr('r', 23)
          .attr('fill', 'white')
          .on('click', () => {
            _this._sketchService.events.sourceNode = null;
            _this.selector.selectAll('.select').remove()
            _this._sketchService.update.emit();
          })

        var arcFrame = d3.arc()
          .innerRadius(23)
          .outerRadius(60);

        var sourceNode = _this._sketchService.events.sourceNode;
        element_types.forEach((d, i) => {
          var arc = select.append('svg:path').attr('class', d)
            .datum({
              startAngle: Math.PI * i * 2 / 3,
              endAngle: Math.PI * (i + 1) * 2 / 3,
            })
            .style('fill', 'white')
            .style('stroke', () => colors[data.collections.length % colors.length][0])
            .style('stroke-width', 4)
            .attr('d', arcFrame)
            .on('mouseover', function() {
              tooltip.text(d)
                .style('visibility', 'visible');

              if (!sourceNode || d != 'stimulator') {
                d3.select(this).style('fill',
                  () => colors[data.collections.length % colors.length][0])
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
                _this._dataService.history(data)
                var idx = data.collections.length;
                var collection = _this.addCollection(idx, point)
                _this._sketchService.resetMouseVars()
                collection.element_type = d;
                collection.model = modelDefaults[d];
                _this.data.collections.push(collection);
                if (sourceNode) {
                  var connectome = _this.addConnectome(data.connectomes.length, sourceNode.idx, collection.idx)
                  _this.data.connectomes.push(connectome);
                }
              }
              _this._sketchService.events.sourceNode = null;
              _this._sketchService.update.emit();
            });

          var f = (i * 2 / 3) + (1 / 3);
          select.append('svg:text')
            .attr('class', 'label')
            .attr('fill', (sourceNode && d == 'stimulator') ? '#cccccc' : 'black')
            .attr('dx', Math.sin(Math.PI * f) * 40)
            .attr('dy', -Math.cos(Math.PI * f) * 40 + 5)
            .text(d.slice(0, 1).toUpperCase());
        })
      })

    this.subscription = this._sketchService.update.subscribe(() => this.update())
    this.update()
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
