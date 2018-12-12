import {
  Component,
  OnInit,
  OnChanges,
  Input,
  ElementRef,
  OnDestroy,
} from '@angular/core';
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
  @Input() data: any;
  @Input() width: any;
  @Input() height: any;
  private host: d3.Selection;
  private selector: d3.Selection;
  private subscription: any;

  constructor(
    private _colorService: ColorService,
    private _controllerService: ControllerService,
    private _dataService: DataService,
    private _sketchService: SketchService,
    private elementRef: ElementRef,
  ) {
    this.host = d3.select(elementRef.nativeElement.parentElement);
    this.selector = d3.select(elementRef.nativeElement);
  }

  ngOnInit() {
    // console.log('Init node sketch')
    this.subscription = this._sketchService.update.subscribe(() => {
      // console.log('Node sketch update emitted')
      this.selector.selectAll(".node").remove()
      this.update()
    })
  }

  ngOnDestroy() {
    // console.log('Destroy node sketch')
    this.subscription.unsubscribe()
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
    var edit = this._controllerService.options.edit;
    var colors = this._colorService.nodes;

    var nodes = this.selector.selectAll("g.node").data(this.data.collections); // UPDATE

    nodes.exit().remove(); // EXIT

    var nodesEnter = nodes.enter().append("svg:g") // ENTER
      .attr('class', 'node')
      .on('click', d => {
        this.selector.selectAll('.select').remove();
        var source = this._sketchService.events.sourceNode;
        if (source) {
          if (d.element_type != 'stimulator') {
            var checkConnectomes = this.data.connectomes.filter(connectome => (connectome.pre.idx == source.idx && connectome.post.idx == d.idx));
            if (checkConnectomes.length == 0) {
              this._dataService.history(this.data)
              this._dataService.records = [];
              var idx = this.data.connectomes.length
              var new_connectome = {
                idx: idx,
                pre: source.idx,
                post: d.idx,
                conn_spec: {
                  rule: 'all_to_all',
                },
                syn_spec: {
                  model: 'static_synapse',
                  weight: 1.0,
                },
              };
              this.data.connectomes.push(new_connectome)
            }
          }
          this._sketchService.events.sourceNode = null;
          this._sketchService.selected.node = null;
          this._sketchService.update.emit()
        } else if (d.element_type != 'recorder') {
          this._sketchService.events.sourceNode = d;
          this._sketchService.toggleSelectNode(d)
        } else if (!edit) {
          this._sketchService.toggleSelectNode(d)
        }
      }).call(d3.drag()
        .on('start', function() {
          d3.select(this).classed('active', true)
        })
        .on('drag', d => {
          if (edit) return
          d.sketch.x = d3.event.x;
          d.sketch.y = d3.event.y;
          this._sketchService.update.emit()
        })
        .on('end', function() {
          d3.select(this).classed('active', false)
        })
      )

    nodesEnter.append('svg:circle')
      .attr('r', 23)
      .style('stroke', d => colors[d.idx % colors.length][0])
      .style('stroke-dasharray', d => this._sketchService.isSelectedNode(d) ? '9' : '');

    nodes.merge(nodesEnter) // ENTER + UPDATE
      .attr('transform', d => 'translate(' + d.sketch.x + ',' + d.sketch.y + ')');

    nodes.selectAll('circle')
      .style('stroke', d => colors[d.idx % colors.length][0])
      .style('stroke-dasharray', d => this._sketchService.isSelectedNode(d) ? '9' : '');

    nodesEnter.append('svg:text')
      .attr('dx', 0)
      .attr('dy', '.4em')
      .text(d => d.idx);

    if (edit) {
      nodes.on('.drag', null)
    } else {
      this._sketchService.events.sourceNode = null;
      nodes.call(d3.drag()
        .on('start', function() {
          d3.select(this).classed('active', true)
        })
        .on('drag', d => {
          if (edit) return
          if (d3.event.x < 23 || d3.event.x > this.width - 23) return
          if (d3.event.y < 23 || d3.event.y > this.height - 23) return
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
