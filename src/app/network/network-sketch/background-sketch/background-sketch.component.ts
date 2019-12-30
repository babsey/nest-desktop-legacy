import { Component, OnInit, Input, ElementRef, OnChanges, Output, EventEmitter } from '@angular/core';

import * as d3 from 'd3';

import { ColorService } from '../../services/color.service';
import { NetworkService } from '../../services/network.service';
import { NetworkSketchService } from '../network-sketch.service';

import { Data } from '../../../classes/data';
import { AppNode } from '../../../classes/appNode';


@Component({
  selector: 'g[app-background-sketch]',
  template: '',
  styleUrls: ['./background-sketch.component.scss'],
})
export class BackgroundSketchComponent implements OnInit, OnChanges {
  @Input() data: Data;
  @Input() width: number = 600;
  @Input() height: number = 400;
  @Input() eventTrigger: boolean = true;
  @Output() dataChange: EventEmitter<any> = new EventEmitter();
  private host: any;
  private selector: any;
  private sourceNode: any;

  constructor(
    private _colorService: ColorService,
    private _networkService: NetworkService,
    private _networkSketchService: NetworkSketchService,
    private elementRef: ElementRef,
  ) {
    this.host = d3.select(elementRef.nativeElement.parentElement);
    this.selector = d3.select(elementRef.nativeElement);
  }

  ngOnInit() {
    this.init()
    this.resize()
  }

  ngOnChanges() {
    this.resize()
  }

  init(): void {
    // if (this.data == undefined) return
    // console.log('Sketch background init')
    var _this = this;

    var elementTypes = ['recorder', 'neuron', 'stimulator'];
    var background = this.selector.append('svg:rect')
      .attr('class', 'background')
      .style('fill', 'white')
      .attr('width', this.width)
      .attr('height', this.height);

    background.on('mousemove', function() {
        var selectedNode = _this._networkService.selected.node;
        _this._networkSketchService.focused.node = null;
        _this._networkSketchService.focused.link = null;

        if (selectedNode && _this.eventTrigger) {
          var point = d3.mouse(this);
          var target = {
            x: point[0],
            y: point[1],
          };

          var color = _this._colorService.node(selectedNode);
          _this._networkSketchService.dragLine(selectedNode.position, target, color);
        }
      })
      .on('click', () => this.reset())
      .on('contextmenu', function() {
        if (!_this.eventTrigger) return
        d3.event.preventDefault();
        _this.reset();

        if ( !_this.eventTrigger ) return
        if ( _this._networkService.selected.node || _this._networkService.selected.link) return

        var data = _this.data;
        var point = d3.mouse(this);
        var selectPanel = _this.host.select('.select-panel')
          .attr('transform', 'translate(' + point[0] + ',' + point[1] + ')');

        var tooltip = selectPanel.select('.tooltip');
        // var tooltip = select.append('svg:text')
        //   .attr('class', 'tooltip')
        //   .attr('transform', 'translate(0, -45)')
        //   .style('visibility', 'hidden');

        selectPanel.append('svg:circle')
          .attr('class', 'select')
          .attr('fill', 'white')
          .attr('fill-opacity', '0.8')
          .attr('r', 16)
          .on('click', () => _this.reset())
          .on('contextmenu', () => {
            d3.event.preventDefault();
            _this.reset();
          });

        var arcFrame = d3.arc()
          .innerRadius(16)
          .outerRadius(40);

        var colors = _this._colorService.colors();
        elementTypes.forEach((d, i) => {
          selectPanel.append('svg:path').attr('class', "select " +d)
            .datum({
              startAngle: Math.PI * i * 2 / 3,
              endAngle: Math.PI * (i + 1) * 2 / 3,
            })
            .style('fill', 'white')
            .attr('fill-opacity', '0.8')
            .style('stroke', () => colors[data.app.nodes.length % colors.length])
            .style('stroke-width', 2.5)
            .attr('d', arcFrame)
            .on('mouseover', function() {
              tooltip.style('visibility', 'visible')
                .select('.label').text(d);

              if (!_this._networkService.selected.node || d != 'stimulator') {
                d3.select(this).style('fill', () => colors[data.app.nodes.length % colors.length])
              }
            })
            .on('mouseout', function() {
              tooltip.style('visibility', 'hidden');
              d3.select(this).style('fill', 'white');
            })
            .on('mouseup', () => {
              _this.reset();
              _this.create(d, point)
              // console.log('Node change')
              _this.dataChange.emit(_this.data)
            });

          var f = (i * 2 / 3) + (1 / 3);
          selectPanel.append('svg:text')
            .attr('class', 'select label')
            .attr('fill', (_this._networkService.selected.node && d == 'stimulator') ? '#cccccc' : 'black')
            .attr('dx', Math.sin(Math.PI * f) * 28)
            .attr('dy', -Math.cos(Math.PI * f) * 28 + 5)
            .text(d.slice(0, 1).toUpperCase());
        })
      })
  }

  create(elementType: string, point: number[]): void {
    // console.log('Create node')
    this._networkService.create(this.data, elementType, point);
    this.dataChange.emit(this.data);
  }

  selected(): AppNode {
    return this._networkService.selected.node;
  }

  resize(): void {
    this.selector.select('rect.background')
      .attr('width', this.width)
      .attr('height', this.height);
  }

  reset(): void {
    this._networkService.resetSelection()
    this._networkSketchService.reset();
  }

}
