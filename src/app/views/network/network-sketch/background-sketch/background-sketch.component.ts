import { Component, OnInit, Input, ElementRef, OnChanges, Output, EventEmitter } from '@angular/core';

import * as d3 from 'd3';

import { Network } from '../../../../components/network/network';
import { Node } from '../../../../components/node/node';

import { NetworkSketchService } from '../../../../services/network/network-sketch.service';


@Component({
  selector: 'g[app-background-sketch]',
  template: '',
  styleUrls: ['./background-sketch.component.scss'],
})
export class BackgroundSketchComponent implements OnInit, OnChanges {
  @Input() network: Network;
  @Input() width: number = 600;
  @Input() height: number = 400;
  @Input() eventTrigger: boolean = true;
  private _host: any;
  private _selector: any;
  private _sourceNode: any;

  constructor(
    private _networkSketchService: NetworkSketchService,
    private _elementRef: ElementRef,
  ) {
    this._host = d3.select(_elementRef.nativeElement.parentElement);
    this._selector = d3.select(_elementRef.nativeElement);
  }

  ngOnInit() {
    this.init()
    this.resize()
  }

  ngOnChanges() {
    this.resize()
  }

  init(): void {
    // console.log('Sketch background init')
    const _this = this;

    const elementTypes: string[] = ['recorder', 'neuron', 'stimulator'];
    const background = this._selector.append('svg:rect')
      .attr('class', 'background')
      .style('fill', 'white')
      .attr('width', this.width)
      .attr('height', this.height);

    background.on('mousemove', function() {
      _this.network.view.resetFocus();
      const selectedNode: Node = _this.network.view.selectedNode;
      if (selectedNode && _this.eventTrigger) {
        const point: number[] = d3.mouse(this);
        const target: any = {
          x: point[0],
          y: point[1],
        };
        const color: string = selectedNode.view.color;
        _this._networkSketchService.dragLine(selectedNode.view.position, target, color, true);
      }
    })
      .on('click', () => this.reset())
      .on('contextmenu', function() {
        if (!_this.eventTrigger) return
        d3.event.preventDefault();
        _this.reset();

        if (!_this.eventTrigger) return
        if (_this.network.view.selectedNode || _this.network.view.selectedConnection) return
        const colors: string[] = _this.network.view.colors;

        const point: number[] = d3.mouse(this);
        const selectPanel = _this._host.select('.select-panel')
          .attr('transform', 'translate(' + point[0] + ',' + point[1] + ')');

        const tooltip = selectPanel.select('.tooltip');
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

        const arcFrame = d3.arc()
          .innerRadius(16)
          .outerRadius(40);

        elementTypes.forEach((d, i) => {
          selectPanel.append('svg:path').attr('class', "select " + d)
            .datum({
              startAngle: Math.PI * i * 2 / 3,
              endAngle: Math.PI * (i + 1) * 2 / 3,
            })
            .style('fill', 'white')
            .attr('fill-opacity', '0.8')
            .style('stroke', () => colors[_this.network.nodes.length % colors.length])
            .style('stroke-width', 2.5)
            .attr('d', arcFrame)
            .on('mouseover', function() {
              tooltip.style('visibility', 'visible')
                .select('.label').text(d);

              if (!_this.network.view.selectedNode || d !== 'stimulator') {
                d3.select(this).style('fill', () => colors[_this.network.nodes.length % colors.length])
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
            });

          const f: number = (i * 2 / 3) + (1 / 3);
          selectPanel.append('svg:text')
            .attr('class', 'select label')
            .attr('fill', (_this.network.view.selectedNode && d === 'stimulator') ? '#cccccc' : 'black')
            .attr('dx', Math.sin(Math.PI * f) * 28)
            .attr('dy', -Math.cos(Math.PI * f) * 28 + 5)
            .text(d.slice(0, 1).toUpperCase());
        })
      })
  }

  reset(): void {
    this.network.view.resetSelection();
    this._networkSketchService.reset();
  }

  create(elementType: string, point: number[]): void {
    // console.log('Create node')
    const defaultModels: any = {
      neuron: 'iaf_psc_alpha',
      recorder: 'voltmeter',
      stimulator: 'dc_generator',
    }
    const node: any = {
      model: defaultModels[elementType],
      view: {
        elementType: elementType,
        position: { x: point[0], y: point[1] },
      },
    };
    this.network.addNode(node);
    this.network.commit();
  }

  resize(): void {
    this._selector.select('rect.background')
      .attr('width', this.width)
      .attr('height', this.height);
  }

}
