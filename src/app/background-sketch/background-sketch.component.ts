import {
  Component,
  OnInit
} from '@angular/core';
import * as d3 from 'd3';

import { DataService } from '../shared/services/data/data.service';
import { SketchService } from '../shared/services/sketch/sketch.service';

@Component({
  selector: 'g[app-background-sketch]',
  template: '',
  styleUrls: ['./background-sketch.component.css'],
})
export class BackgroundSketchComponent implements OnInit {
  private drag_line: any;

  constructor(private service: SketchService, private _dataService: DataService) {
  }

  addCollection(idx, point) {
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
    var data = this._dataService.data;
    var options = this.service.options;
    d3.select('rect.background')
      .attr('width', options.width)
      .attr('height', options.height)

    if (!this.service.events.sourceNode) {
      this.drag_line.attr('d', 'M0,0L0,0')
        .style('marker-end', '');
    }

    if (!this.service.options.drawing) {
      d3.select('g[app-background-sketch]').selectAll('.select').remove();
    }

  }

  ngOnInit() {
    var self = this;
    var options = this.service.options;
    var colors = options.nodes.colors;

    var element_types = ['recorder', 'neuron', 'stimulator'];
    var modelDefaults = {
      stimulator: 'dc_generator',
      neuron: 'iaf_psc_alpha',
      recorder: 'voltmeter',
    };

    d3.select('g[app-background-sketch]').append('rect')
      .attr('class', 'background')
      .style('fill', options.background)
      .style('opacity', .5)
      .attr('width', options.width || 800)
      .attr('height', options.height || 600)

    d3.select('rect.background')
      .on('mousemove', function() {
        var source = self.service.events.sourceNode;
        if (source) {
          var point = d3.mouse(this);
          self.drag_line
            .attr('d', 'M' + source.x + ',' + source.y + 'L' + point[0] + ',' + point[1])
            .style('marker-end', 'url(#end-arrow)');
        }
        self.service.update.emit();
      })
      .on('dblclick', function() {
        self.service.events.sourceNode = null;
        d3.select('g[app-background-sketch]').selectAll('.select').remove();
        self.service.update.emit();
      })
      .on('click', function() {
        var point = d3.mouse(this);
        var data = self._dataService.data;
        var g = d3.select('g[app-background-sketch]');
        g.selectAll('.select').remove();
        self.service.resetMouseVars()
        if (!options.drawing) {
          self.service.options.show = false;
          return
        }

        var arcFrame = d3.arc()
          .innerRadius(23)
          .outerRadius(60);

        var sourceNode = self.service.events.sourceNode;
        element_types.map((d, i) => {
          var select = g.append('g')
            .attr('class', 'select')
            .attr('transform', 'translate(' + point[0] + ',' + point[1] + ')');

          var arc = select.append('path').attr('class', d)
            .datum({
              startAngle: Math.PI * i * 2 / 3,
              endAngle: Math.PI * (i + 1) * 2 / 3,
            })
            .style('fill', 'white')
            .style('stroke', () => colors[data.collections.length % colors.length])
            .style('stroke-width', 4)
            .attr('d', arcFrame)
            .on('mouseover', function() {
              if (!sourceNode || d != 'stimulator') {
                d3.select(this).style('fill',
                  () => colors[data.collections.length % colors.length])
              }
            })
            .on('mouseout', function() {
              d3.select(this).style('fill', 'white')
            })
            .on('mousemove', function() {
              self.service.update.emit();
            })
            .on('mouseup', () => {
              g.selectAll('.select').remove();
              var sourceNode = self.service.events.sourceNode;
              if (!sourceNode || d != 'stimulator') {
                var collection = self.addCollection(data.collections.length, point)
                self.service.resetMouseVars()
                collection.element_type = d;
                collection.model = modelDefaults[d];
                data.collections.push(collection);

                if (sourceNode) {
                  var connectome = self.addConnectome(data.connectomes.length, sourceNode.idx, collection.idx)
                  data.connectomes.push(connectome);
                }
              }
              self.service.events.sourceNode = null;
              self.service.update.emit();
            });

          var f = (i * 2 / 3) + (1 / 3);
          select.append('text')
            .attr('fill', (sourceNode && d == 'stimulator') ? '#cccccc' : 'black')
            .attr('dx', Math.sin(Math.PI * f) * 40)
            .attr('dy', -Math.cos(Math.PI * f) * 40 + 5)
            .text(d.slice(0, 1).toUpperCase());
        })
      })


    this.drag_line = d3.select('g[app-background-sketch]').append('svg:path')
      .attr('class', 'connection dragline')
      .style('pointer-events', 'none')
      .style('stroke', 'black')
      .style('stroke-width', '3px')
      .attr('d', 'M0,0L0,0');

    this.service.update.subscribe(() => this.update())
  }
}
