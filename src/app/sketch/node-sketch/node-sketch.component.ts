import { Component, OnInit, OnChanges, Input, ElementRef, OnDestroy } from '@angular/core';

import * as d3 from 'd3';

import { ColorService } from '../../services/color/color.service';
import { ControllerService } from '../../controller/controller.service';
import { DataService } from '../../services/data/data.service';
import { SketchService } from '../sketch.service';

@Component({
  selector: 'g[app-node-sketch]',
  template: '',
  styleUrls: ['./node-sketch.component.css'],
})
export class NodeSketchComponent implements OnInit, OnChanges, OnDestroy {
  @Input() data: any = {};
  @Input() width: number;
  @Input() height: number;
  private host: d3.Selection;
  private selector: d3.Selection;
  private subscription$: any;

  constructor(
    private _colorService: ColorService,
    public _controllerService: ControllerService,
    private _dataService: DataService,
    private _sketchService: SketchService,
    private elementRef: ElementRef,
  ) {
    this.host = d3.select(elementRef.nativeElement.parentElement);
    this.selector = d3.select(elementRef.nativeElement);
  }

  ngOnInit() {
    // console.log('Init node sketch')
    this.subscription$ = this._sketchService.update.subscribe(() => {
      // console.log('Node sketch update emitted')
      this.selector.selectAll(".node").remove()
      this.update()
    })
  }

  ngOnDestroy() {
    // console.log('Destroy node sketch')
    this.subscription$.unsubscribe()
  }

  ngOnChanges() {
    // console.log('Change node sketch')
    this.selector.selectAll(".node").remove()
    this.update()
  }

  update() {
    // console.log('Update node sketch')
    if (this.data == undefined) return
    if (Object.keys(this.data).length === 0 && this.data.constructor === Object) return
    let drawing = this._sketchService.options.drawing;
    let r = this._sketchService.options.node.radius

    var nodes = this.selector.selectAll("g.node").data(this.data.collections); // UPDATE

    nodes.exit().remove(); // EXIT

    var nodesEnter = nodes.enter().append("svg:g") // ENTER
      .attr('class', 'node')
      .on('dblclick', d => {
        if (d.element_type == 'neuron') {
          this._dataService.history(this.data)
          var checkConnectomes = this.data.connectomes.filter(connectome => (connectome.pre == d.idx && connectome.post == d.idx));
          if (checkConnectomes.length > 0) {
            this._dataService.deleteLink(checkConnectomes[0].idx)
          } else {
            var newLink = this._dataService.newLink();
            newLink['idx'] = this.data.connectomes.length;
            newLink['pre'] = d.idx;
            newLink['post'] = d.idx;
            this.data.connectomes.push(newLink)
          }
          this._sketchService.update.emit()
        }
      })
      .on('click', d => {
        this._controllerService.selected = null;
        this.selector.selectAll('.select').remove();
        var source = this._sketchService.events.sourceNode;
        if (source == null || source != this._sketchService.selected.node) {
          this._sketchService.toggleSelectNode(d);
        }
        if (source) {
          if (source.idx == d.idx) return
          if (d.element_type != 'stimulator') {
            var checkConnectomes = this.data.connectomes.filter(connectome => (connectome.pre == source.idx && connectome.post == d.idx));
            if (checkConnectomes.length == 0) {
              this._dataService.history(this.data)
              var newLink = this._dataService.newLink();
              newLink['idx'] = this.data.connectomes.length;
              newLink['pre'] = source.idx;
              newLink['post'] = d.idx;
              this.data.connectomes.push(newLink)
            }
          }
        }
        this._sketchService.events.sourceNode = null;
        if (drawing && d.element_type != 'recorder') {
          this._sketchService.events.sourceNode = d;
        }
        this._sketchService.update.emit()
      }).call(d3.drag()
        .on('drag', d => {
          if (drawing) return
          d.sketch.x = d3.event.x;
          d.sketch.y = d3.event.y;
          this._sketchService.update.emit()
        })
      )

    nodesEnter.append('svg:rect')
      .attr('width', 2 * r)
      .attr('height', 2 * r)
      .attr('x', -r)
      .attr('y', -r)
      .attr('rx', d => d.element_type == 'recorder' ? r / 2 : r)
      .attr('ry', d => d.element_type == 'stimulator' ? 0 : r)
      .style('stroke', d => this._colorService.node(d))
      .style('stroke-dasharray', d => this._sketchService.isSelectedNode(d) ? '9' : '');
    var tooltip = nodesEnter.append('svg:text')
      .text(d => this._sketchService.label(d.model))
      .attr('class', 'tooltip')
      .attr('transform', 'translate(0, -' + (r + 6) + ')');

    nodesEnter
      .on('mouseover', function() {
        d3.select(this).classed('active', true)
      })
      .on('mouseout', function() {
        d3.select(this).classed('active', false)
      })

    nodes.merge(nodesEnter) // ENTER + UPDATE
      .attr('transform', d => 'translate(' + d.sketch.x + ',' + d.sketch.y + ')');

    nodes.selectAll('rect')
      .style('stroke', d => this._colorService.node(d))
      .style('stroke-dasharray', d => this._sketchService.isSelectedNode(d) ? '9' : '');

    nodesEnter.append('svg:text')
      .attr('class', 'label')
      .attr('dx', 0)
      .attr('dy', '.4em')
      .text(d => d.idx + 1);

    if (drawing) {
      nodes.on('.drag', null)
    } else {
      this._sketchService.events.sourceNode = null;
      nodes.call(d3.drag()
        .on('start', function() {
          d3.select(this).classed('active', true)
        })
        .on('drag', d => {
          if (drawing) return
          if (d3.event.x < r || d3.event.x > this.width - r) return
          if (d3.event.y < r || d3.event.y > this.height - r) return
          d.sketch.x = d3.event.x;
          d.sketch.y = d3.event.y;
          this._sketchService.update.emit()
        })
        .on('end', function() {
          d3.select(this).classed('active', false)
        })
      )
    }
  }
}
