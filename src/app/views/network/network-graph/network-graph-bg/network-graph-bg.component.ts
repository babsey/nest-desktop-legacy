import { Component, OnInit, Input, ElementRef, OnChanges, Output, EventEmitter } from '@angular/core';

import { arc } from 'd3-shape';
import { select } from 'd3-selection';

import { Network } from '../../../../components/network/network';
import { Node } from '../../../../components/node/node';

import { NetworkGraphService } from '../../../../services/network/network-graph.service';


@Component({
  selector: 'g[app-network-graph-bg]',
  template: '',
  styleUrls: ['./network-graph-bg.component.scss'],
})
export class NetworkGraphBgComponent implements OnInit, OnChanges {
  @Input() eventTrigger = true;
  @Input() height = 400;
  @Input() network: Network;
  @Input() width = 600;
  private _host: any;
  private _selector: any;
  private _sourceNode: any;

  constructor(
    private _networkGraphService: NetworkGraphService,
    private _elementRef: ElementRef,
  ) {
    this._host = select(_elementRef.nativeElement.parentElement);
    this._selector = select(_elementRef.nativeElement);
  }

  ngOnInit() {
    this.init();
    this.resize();
  }

  ngOnChanges() {
    this.resize();
  }

  init(): void {
    // console.log('Init network graph background')

    const elementTypes: string[] = ['recorder', 'neuron', 'stimulator'];
    const background = this._selector.append('svg:rect')
      .attr('class', 'background')
      .style('fill', 'white')
      .attr('width', this.width)
      .attr('height', this.height);

    background.on('mousemove', (event: MouseEvent) => {
      // console.log(event);
      this.network.view.resetFocus();
      const selectedNode: Node = this.network.view.selectedNode;
      if (selectedNode && this.eventTrigger) {
        const target: any = {
          x: event.offsetX,
          y: event.offsetY,
        };
        const color: string = selectedNode.view.color;
        this._networkGraphService.dragLine(selectedNode.view.position, target, color, true);
      }
    })
      .on('click', () => this.reset())
      .on('contextmenu', (event: MouseEvent) => {
        // console.log(event);
        if (!this.eventTrigger) { return; }
        event.preventDefault();
        this.reset();

        if (!this.eventTrigger) { return; }
        if (this.network.view.selectedNode || this.network.view.selectedConnection) { return; }
        const colors: string[] = this.network.view.colors;

        const x: number = event.offsetX;
        const y: number = event.offsetY;
        const selectPanel = this._host.select('.select-panel')
          .attr('transform', `translate(${x},${y})`);

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
          .on('click', () => this.reset())
          .on('contextmenu', (e: MouseEvent) => {
            e.preventDefault();
            this.reset();
          });

        const arcFrame = arc()
          .innerRadius(16)
          .outerRadius(40);

        elementTypes.forEach((elementType: string, i: number) => {
          const panel: any = selectPanel.append('svg:path').attr('class', 'select ' + elementType)
            .datum({
              startAngle: Math.PI * i * 2 / 3,
              endAngle: Math.PI * (i + 1) * 2 / 3,
            })
            .style('fill', 'white')
            .attr('fill-opacity', '0.8')
            .style('stroke', () => colors[this.network.nodes.length % colors.length])
            .style('stroke-width', 2.5)
            .attr('d', arcFrame)
            .on('mouseover', (e: MouseEvent) => {
              tooltip.style('visibility', 'visible')
                .select('.label').text(elementType);
              if (!this.network.view.selectedNode || elementType !== 'stimulator') {
                panel.style('fill', () => colors[this.network.nodes.length % colors.length]);
              }
            })
            .on('mouseout', (e: MouseEvent) => {
              tooltip.style('visibility', 'hidden')
                .select('.label').text('');
              panel.style('fill', 'white');
            })
            .on('mouseup', () => {
              this.reset();
              const view: any = {
                elementType,
                position: { x, y },
              };
              this.create(view);
            });

          const f: number = (i * 2 / 3) + (1 / 3);
          selectPanel.append('svg:text')
            .attr('class', 'select label')
            .attr('fill', (this.network.view.selectedNode && elementType === 'stimulator') ? '#cccccc' : 'black')
            .attr('dx', Math.sin(Math.PI * f) * 28)
            .attr('dy', -Math.cos(Math.PI * f) * 28 + 5)
            .text(elementType.slice(0, 1).toUpperCase());
        });
      });
  }

  reset(): void {
    const selectPanel = this._host.select('.select-panel');
    const tooltip = selectPanel.select('.tooltip');
    tooltip.style('visibility', 'hidden')
      .select('.label').text('');
    this.network.view.resetSelection();
    this._networkGraphService.reset();
  }

  create(view): void {
    // console.log('Create node')
    const defaultModels: any = {
      neuron: 'iaf_psc_alpha',
      recorder: 'voltmeter',
      stimulator: 'dc_generator',
    };
    const node: any = {
      model: defaultModels[view.elementType],
      view,
    };
    this.network.addNode(node);
    if (view.elementType === 'recorder') {
      this.network.project.initActivityGraph();
    }
    this.network.networkChanges();
  }

  resize(): void {
    this._selector.select('rect.background')
      .attr('width', this.width)
      .attr('height', this.height);
  }

}
