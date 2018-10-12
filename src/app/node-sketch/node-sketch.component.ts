import {
  Component,
  OnInit
} from '@angular/core';
import * as d3 from 'd3';

import { DataService } from '../shared/services/data/data.service';
import { SketchService } from '../shared/services/sketch/sketch.service';

@Component({
  selector: 'g[app-node-sketch]',
  template: '',
  styleUrls: ['./node-sketch.component.css'],
})
export class NodeSketchComponent implements OnInit {

  constructor(private service: SketchService, private _dataService: DataService) {
  }

  update() {
    var self = this;
    var data = this._dataService.data;
    var options = this.service.options;
    var colors = options.nodes.colors;

    var nodes = d3.select('g[app-node-sketch]').selectAll("g.node").data(data.collections); // UPDATE

    nodes.exit().remove(); // EXIT

    var nodesEnter = nodes.enter().append("g") // ENTER
      .attr('class', 'node')
      .on('click', (d) => {
        d3.select('g[app-background-sketch]').selectAll('.select').remove();
        var source = self.service.events.sourceNode;
        if (source) {
            if (d.element_type != 'stimulator') {
                var checkConnectomes = data.connectomes.filter(connectome => (connectome.pre.idx == source.idx && connectome.post.idx == d.idx));
                if (checkConnectomes.length == 0) {
                    var new_connectome = {
                        idx: data.connectomes.length,
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
                    data.connectomes.push(new_connectome)
                }
            }
            self.service.events.sourceNode = null;
            self.service.selected.node = null;
            self.service.update.emit()
        } else if (d.element_type != 'recorder') {
            self.service.events.sourceNode = d;
            self.service.toggleSelectNode(d)
        } else if (!options.drawing) {
          self.service.toggleSelectNode(d)
        }
        // if (!options.drawing) {
        // }
      }).call(d3.drag()
        .on('start', function() {
          d3.select(this).classed('active', true)
        })
        .on('drag', d => {
          if (options.drawing) return
          d.sketch.x = d3.event.x;
          d.sketch.y = d3.event.y;
          self.service.update.emit()
        })
        .on('end', function() {
          d3.select(this).classed('active', false)
        })
      )

    nodesEnter.append('circle')
      .attr('r', 23)
      .style('stroke', d => colors[d.idx % colors.length][0])
      .style('stroke-dasharray', d => this.service.isSelectedNode(d) ? '9' : '');

    nodes.merge(nodesEnter) // ENTER + UPDATE
      .attr('transform', d => 'translate(' + d.sketch.x + ',' + d.sketch.y + ')');

    nodes.selectAll('circle')
      .style('stroke', d => colors[d.idx % colors.length][0])
      .style('stroke-dasharray', d => this.service.isSelectedNode(d) ? '9' : '');

    nodesEnter.append('text')
      .attr('dx', 0)
      .attr('dy', '.4em')
      .text(d => d.idx);

    if (options.drawing) {
      nodes.on('.drag', null)
    } else {
      self.service.events.sourceNode = null;
      nodes.call(d3.drag()
        .on('start', function() {
          d3.select(this).classed('active', true)
        })
        .on('drag', d => {
          if (options.drawing) return
          d.sketch.x = d3.event.x;
          d.sketch.y = d3.event.y;
          self.service.update.emit()
        })
        .on('end', function() {
          d3.select(this).classed('active', false)
        })
      )
    }

  }

  ngOnInit() {
    this.update()
    this.service.update.subscribe(() => this.update())
  }

}
