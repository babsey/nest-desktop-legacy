import { Component, OnInit, Input, ElementRef, OnDestroy, OnChanges, Output, EventEmitter } from '@angular/core';

import * as d3 from 'd3';

import { ColorService } from '../../services/color.service';
import { DataService } from '../../../services/data/data.service';
import { NetworkService } from '../../services/network.service';
import { NetworkSketchService } from '../network-sketch.service';

import { Data } from '../../../classes/data';


@Component({
  selector: 'g[app-background-sketch]',
  template: '',
  styleUrls: ['./background-sketch.component.scss'],
})
export class BackgroundSketchComponent implements OnInit, OnDestroy, OnChanges {
  @Input() data: Data;
  @Input() width: number = 600;
  @Input() height: number = 400;
  @Output() nodeChange: EventEmitter<any> = new EventEmitter();
  private selector: any;
  private dragline: any;
  private subscription: any;
  private sourceNode: any;

  constructor(
    private _colorService: ColorService,
    private _dataService: DataService,
    private _networkService: NetworkService,
    private _networkSketchService: NetworkSketchService,
    private elementRef: ElementRef,
  ) {
    this.selector = d3.select(elementRef.nativeElement);
  }

  ngOnInit() {
    this.init()
    this.subscription = this._networkSketchService.update.subscribe(() => this.update())
    this.update()
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  ngOnChanges() {
    this.update()
  }

  selected() {
    return this._networkService.selected.node;
  }

  init() {
    // if (this.data == undefined) return
    // console.log('Sketch background init')
    var _this = this;

    var elementTypes = ['recorder', 'neuron', 'stimulator'];
    var background = this.selector.append('svg:rect')
      .attr('class', 'background')
      .style('fill', 'white')
      .attr('width', this.width)
      .attr('height', this.height);

    this.dragline = this.selector.append('svg:path')
      .attr('class', 'link dragline')
      .style('pointer-events', 'none')
      .attr('d', 'M0,0L0,0');

    background.on('mousemove', function() {
        var colors = _this._colorService.colors();
        var selected = _this._networkService.selected.node;
        _this._networkSketchService.focused.node = null;
        _this._networkSketchService.focused.link = null;

        if (selected && _this._networkSketchService.options.drawing) {
          var point = d3.mouse(this);
          var target = {
            x: point[0],
            y: point[1],
          };
          _this.dragline
            .attr('d', _this._networkSketchService.drawPath(selected.position, target))
            .style('fill', 'none')
            .style('stroke', () => colors[selected.idx % colors.length])
            .style('stroke-width', '2.5px')
            .style('marker-start', () => 'url(#hillock_' + colors[selected.idx % colors.length] + ')')
            .style('marker-end', () => 'url(#exc_' + colors[selected.idx % colors.length] + ')');
        }
      })
      .on('click', function() {
        // console.log('Click background')
        var data = _this.data;
        if (data == undefined) return
        _this.selector.selectAll('.select').remove();

        var selectedNode = _this._networkService.selected.node;
        if (selectedNode) {
          _this._networkService.resetMouseVars()
          _this.resetDragLine()
          _this.nodeChange.emit(_this.data)
          return
        }

        var selectedLink = _this._networkService.selected.link;
        if (selectedLink) {
          _this._networkService.resetMouseVars()
          _this.nodeChange.emit(_this.data)
          return
        }

        if (!_this._networkSketchService.options.drawing) {
          _this._networkSketchService.options.show = false;
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
            _this._networkService.selected.node = null;
            _this.selector.selectAll('.select').remove()
          })

        var arcFrame = d3.arc()
          .innerRadius(16)
          .outerRadius(40);

        var colors = _this._colorService.colors();
        elementTypes.forEach((d, i) => {
          select.append('svg:path').attr('class', d)
            .datum({
              startAngle: Math.PI * i * 2 / 3,
              endAngle: Math.PI * (i + 1) * 2 / 3,
            })
            .style('fill', 'white')
            .style('stroke', () => colors[data.app.nodes.length % colors.length])
            .style('stroke-width', 2.5)
            .attr('d', arcFrame)
            .on('mouseover', function() {
              tooltip.text(d)
                .style('visibility', 'visible');

              if (!selectedNode || d != 'stimulator') {
                d3.select(this).style('fill', () => colors[data.app.nodes.length % colors.length])
              }
            })
            .on('mouseout', function() {
              tooltip.style('visibility', 'hidden');
              d3.select(this).style('fill', 'white');
            })
            .on('mouseup', () => {
              _this.selector.selectAll('.select').remove();
              _this._networkService.resetMouseVars()
              _this.create(d, point)
              // console.log('Node change')
              _this.nodeChange.emit(_this.data)
            });

          var f = (i * 2 / 3) + (1 / 3);
          select.append('svg:text')
            .attr('class', 'label')
            .attr('fill', (selectedNode && d == 'stimulator') ? '#cccccc' : 'black')
            .attr('dx', Math.sin(Math.PI * f) * 28)
            .attr('dy', -Math.cos(Math.PI * f) * 28 + 5)
            .text(d.slice(0, 1).toUpperCase());
        })
      })
  }

  create(elementType, point) {
    var modelDefaults = {
      stimulator: 'dc_generator',
      neuron: 'iaf_psc_alpha',
      recorder: 'voltmeter',
    };

    var idx = this.data.app.nodes.length;
    var newModel = elementType + '-' + idx;
    this.data.app.models[newModel] = {};
    this.data.simulation.models[newModel] = {
      existing: modelDefaults[elementType],
      params: {},
    };
    var newNode = {
      idx: idx,
      position: { 'x': point[0], 'y': point[1] }
    };
    this.data.app.nodes.push(newNode);
    var newCollection = {
      element_type: elementType,
      model: newModel,
    }
    this.data.simulation.collections.push(newCollection);
    this.data['hash'] = this._dataService.hash(this.data['simulation']);
  }

  update() {
    if (this.data == undefined) return
    this.selector.select('rect.background')
      .attr('width', this.width)
      .attr('height', this.height);

    if (this._networkService.selected.node == null) {
      this.resetDragLine()
    }

    if (!this._networkSketchService.options.drawing) {
      this.selector.selectAll('.select').remove();
    }

  }

  resetDragLine() {
    if (this.dragline) {
      this.dragline.attr('d', 'M0,0L0,0')
      .style('marker-start', '')
      .style('marker-end', '');
    }
  }

}
