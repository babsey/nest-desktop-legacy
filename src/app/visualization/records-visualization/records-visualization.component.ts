import { Component, OnInit, OnChanges, OnDestroy, Input } from '@angular/core';

import { MathService } from '../../services/math/math.service';
import { RecordsVisualizationService } from './records-visualization.service';

import { Data } from '../../classes/data';

@Component({
  selector: 'app-records-visualization',
  templateUrl: './records-visualization.component.html',
  styleUrls: ['./records-visualization.component.scss']
})
export class RecordsVisualizationComponent implements OnInit, OnDestroy, OnChanges {
  @Input() data: Data;
  @Input() records: any[];
  public _data: any[] = [];
  public frames: any[] = [];
  public layout: any = {
    title: 'No data found',
  };
  public config: any = {};
  public style: any = {
    position: 'relative',
    width: '100%',
    height: 'calc(100vh - 40px)',
  }
  private threshold: any = 'legendonly';
  private subscription: any;
  private nframes = 10000;

  constructor(
    private _mathService: MathService,
    public _recordsVisualizationService: RecordsVisualizationService,
  ) {
  }

  ngOnInit() {
    // console.log('Record visualization on init')
    this.init()
    // this.subscription = this._recordsVisualizationService.update.subscribe(() => this.update())
    this.subscription = this._recordsVisualizationService.init.subscribe(() => this.init())
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  ngOnChanges() {
    // console.log('Record visualization on changes')
    this.update()
  }

  init() {
    // console.log('Init records visualization')
    this.config = {
      scrollZoom: true,
      editable: true,
      displayModeBar: true,
      displaylogo: false,
      responsive: true,
      showLink: true,
      toImageButtonOptions: {
        format: 'svg', // one of png, svg, jpeg, webp
        filename: 'newplot',
        width: 1280,
        height: 1024,
        scale: 1, // Multiply title/legend/axis/canvas sizes by this factor
      },
    };

    this.layout = {
      title: {
        text: this.data.name,
        xref: 'paper',
        x: 0.05,
      },
      xaxis: {
        title: 'Time [ms]',
      }
    };
    this._data = [];
    this.frames = [];
    this.update()
  }

  update() {
    // console.log('Update records visualization')
    this._data = [];
    this.frames = [];
    var records = this.records;
    if (records.length == 0) return

    records.map(record => {
      if (record.recorder.model == 'spike_detector') {
        this.isSpatial(record) ? this.plotSpatialSpikeData(record) : this.plotSpikeData(record)
      } else {
        var node = this.data.app.nodes[record.recorder.idx];
        if (node == undefined) return
        if (node.hasOwnProperty('record_from')) {
          node.record_from.map(record_from => this.plotAnalogData(record, record_from))
        } else {
          this.plotAnalogData(record)
        }
      }
    })

    var barmode = this._recordsVisualizationService.barmode;
    var barnorm = this._recordsVisualizationService.barnorm;
    if (this.hasSpikeData() && this.hasAnalogData()) {
      this.layout['yaxis'] = {
        // title: 'Firing rate [Hz]',
        title: 'Spike count',
        domain: [0, 0.19],
      }
      this.layout['yaxis2'] = {
        title: 'Neuron ID',
        domain: [0.21, .49],
      }
      var y3Title = 'Membrane potentials [mV]'
      if (this.hasInputData()) {
        this.layout['yaxis3'] = {
          title: y3Title,
          domain: [.51, .84],
        }
        this.layout['yaxis4'] = {
          title: 'Current [pA]',
          zeroline: false,
          domain: [.86, 1],
        }
      } else {
        this.layout['yaxis3'] = {
          title: y3Title,
          domain: [.51, 1],
        }
      }
    } else if (this.hasAnalogData()) {
      var y3Title = 'Membrane potential [mV]'
      if (this.hasInputData()) {
        this.layout['yaxis3'] = {
          title: y3Title,
          domain: [0, .66],
        }
        this.layout['yaxis4'] = {
          zeroline: false,
          title: 'Current [pA]',
          domain: [.7, 1],
        }
      } else {
        this.layout['yaxis3'] = {
          title: y3Title,
          domain: [0, 1],
        }
      }
    } else if (this.hasSpikeData()) {
      this.layout['yaxis'] = {
        // title: 'Firing rate [Hz]',
        title: 'Spike count',
        domain: [0, 0.2],
      }
      this.layout['yaxis2'] = {
        title: 'Neuron ID',
        domain: [0.22, 1],
      }
      this.layout['barmode'] = barmode;
      this.layout['barnorm'] = barnorm;
    }

    // console.log(this.data, this.frames, this.layout)
  }

  plotSpikeData(record) {
    var x: any[] = record.events.times;
    var y: any[] = record.events.senders;

    var start: number = 0.;
    var end: number = this.data.app.kernel['time'];
    var size: number = this._recordsVisualizationService.binsize;
    var node = this.data.app.nodes[record.recorder.idx];
    var color: string = this._recordsVisualizationService.nodeColor(node);

    this._data.push(this.scatter(record.idx, x, y, color));
    this._data.push(this.histogram(record.idx, x, start, end, size, color));
  }

  getSpatialNodes(record) {
    return this.data.simulation.connectomes
      .filter(connectome => connectome.post == record.recorder.idx)
      .filter(connectome => this.data.app.nodes[connectome.pre].hasOwnProperty('positions'))
      .map(connectome => this.data.app.nodes[connectome.pre]);
  }

  isSpatial(record) {
    return this.getSpatialNodes(record).length > 0 && this._recordsVisualizationService.method == 'animation';
  }

  plotSpatialSpikeData(record) {
    var senders: any[] = record.events.senders;
    var spatialNodes = this.getSpatialNodes(record)[0];
    if (spatialNodes == undefined) return
    var positions = spatialNodes.positions;
    var global_ids = spatialNodes.global_ids;
    if (global_ids == undefined || positions == undefined) return
    var node = this.data.app.nodes[record.recorder.idx];
    var color: string = this._recordsVisualizationService.nodeColor(node);

    var x: any[] = record.events.times;
    var y: any[] = [];
    var z: any[] = [];
    senders.map(sender => {
      var pos = positions[global_ids.indexOf(sender)];
      y.push(pos[0])
      z.push(pos[1])
    })
    this.scatterFrames(record.idx, x, y, z, color);
    this._data.push(this.scatter(record.idx, [], [], color))

    var sliderSteps = [];
    for (var i = 0; i < this.nframes; i++) {
      sliderSteps.push({
        method: 'animate',
        label: i * 1000. / this.nframes,
        args: [[i], {
          mode: 'immediate',
          transition: { duration: 300 },
          frame: { duration: 300, redraw: false },
        }]
      })
    }

    this.layout['extent'] = [
      // [-this.records.length * 2 - 1, this.records.length * 2],
      [-1, 0],
      [-.5, .5],
      [.5, -.5]
    ];

    this.layout['updatemenus'] = [{
      x: 0,
      y: 0,
      yanchor: 'top',
      xanchor: 'left',
      showactive: false,
      direction: 'left',
      type: 'buttons',
      pad: { t: 87, r: 10 },
      buttons: [{
        method: 'animate',
        args: [null, {
          mode: 'immediate',
          fromcurrent: true,
          transition: { duration: 300 },
          frame: { duration: 500, redraw: false }
        }],
        label: 'Play'
      }, {
        method: 'animate',
        args: [[null], {
          mode: 'immediate',
          transition: { duration: 0 },
          frame: { duration: 0, redraw: false }
        }],
        label: 'Pause'
      }]
    }]

    this.layout['sliders'] = [{
      pad: { l: 130, t: 55 },
      currentvalue: {
        visible: true,
        prefix: 'Time [ms]:',
        xanchor: 'right',
        font: { size: 20, color: '#666' }
      },
      steps: sliderSteps
    }]

  }

  plotAnalogData(record, record_from = 'V_m') {
    if (record_from == 'V_m') {
      var time = this.data.app.kernel['time'] || 1000;
      var Vth = -55;

      var x: any[] = [0, time];
      var y: any[] = [Vth, Vth];

      var config = { hoverinfo: 'none', visible: 'legendonly', 'line.dash': 'dash' };
      this._data.push(this.plot(record.idx, x, y, 'black', 'V_m threshold', config))
    }

    var recorder = record.recorder;
    var node = this.data.app.nodes[recorder.idx];
    var color: string = this._recordsVisualizationService.nodeColor(node);

    if (record_from == 'V_m') {
      this._data[0]['showlegend'] = true;
      this._data[0]['visible'] = this.threshold;
    }

    var neurons = this.data.simulation.connectomes
      .filter(d => d.pre == recorder.idx)
      .map(d => this.data.simulation.collections[d.post]);
    var senders = record.events['senders'].filter(this._mathService.onlyUnique);

    var data = senders.map(sender => { return { x: [], y: [] } });
    record.events['senders'].forEach((sender, idx) => {
      var senderIdx = senders.indexOf(sender);
      data[senderIdx].x.push(record.events['times'][idx])
      data[senderIdx].y.push(record.events[record_from][idx])
    })

    var yaxis = this.hasInputData(recorder.idx) ? 'y4' : 'y3';
    if (data.length == 1) {
      var label = record_from + ' of ' + (recorder.idx + 1);
      var config0 = { hoverinfo: 'full', showlegend: true };
      this._data.push(this.plot(recorder.idx, data[0].x, data[0].y, color, label, config0, yaxis));
    } else if (data.length > 1) {

      var x: any[] = data[0].x;
      var y: any[] = x.map((d, i) => {
        var yi: any[] = [];
        senders.map((sender, senderIdx) => {
          yi.push(data[senderIdx].y[i])
        })
        var sum: number = yi.reduce((a, b) => (a + b));
        var avg: number = sum / senders.length;
        return avg
      })

      var label = record_from + ' average';
      var config1 = {};
      this._data.push(this.plot(recorder.idx, x, y, color, label, config1, yaxis))

      data.slice(0, 1).map(d => {
        var label = record_from + ' of [' + senders[0] + ' - ' + senders[senders.length - 1] + ']';
        var config2 = {
          legendgroup: record_from + (record.idx + 1),
          hoverinfo: 'none',
          opacity: 0.5,
        }
        this._data.push(this.plot(recorder.idx, d.x, d.y, color, label, config2, yaxis))
      })

      data.slice(1, 3).map(d => {
        var config3 = {
          legendgroup: record_from + (record.idx + 1),
          showlegend: false,
          hoverinfo: 'none',
          opacity: 0.3,
        }
        this._data.push(this.plot(recorder.idx, d.x, d.y, color, label, config3, yaxis))
      })

      data.slice(3, 20).map(d => {
        var config4 = {
          legendgroup: record_from + (record.idx + 1),
          showlegend: false,
          hoverinfo: 'none',
          opacity: 0.1,
        }
        this._data.push(this.plot(recorder.idx, d.x, d.y, color, label, config4, yaxis))
      })

    }
  }

  plot(idx, x, y, color, label = '', config = {}, yaxis = 'y3') {
    return {
      mode: 'lines',
      type: 'scattergl',
      idx: idx,
      x: x,
      y: y,
      legendgroup: config['legendgroup'] || '',
      hoverinfo: config['hoverinfo'] || 'all',
      showlegend: config['showlegend'] != undefined ? config['showlegend'] : true,
      opacity: config['opacity'] || 1.,
      name: label,
      line: {
        width: 1.5,
        color: color,
        dash: config['line.dash'] || 'none',
      },
      yaxis: yaxis,
    }
  }

  scatter(idx, x, y, color, config = {}, yaxis = 'y2') {
    return {
      mode: 'markers',
      type: 'scattergl',
      idx: idx,
      x: x,
      y: y,
      // name: 'Spikes of ' + (idx + 1),
      name: (this.records[idx].recorder.idx + 1),
      legendgroup: 'spikes' + (idx + 1),
      hoverinfo: config['hoverinfo'] || 'x',
      showlegend: config['showlegend'] != undefined ? config['showlegend'] : true,
      opacity: config['opacity'] || 1.,
      marker: {
        size: 5,
        color: color,
      },
      yaxis: yaxis
    }
  }

  scatterFrames(idx, x, y, z, color, config = {}) {

    if (this.frames.length == 0) {
      for (var i = 0; i < this.nframes; i++) {
        this.frames.push({
          name: i,
          data: [],
        })
      }
    }

    this.frames.forEach(frame => {
      frame.data.push({
        x: [], y: [], z: []
      })
      frame.data[frame.data.length - 1].idx = frame.data.length - 1;
    })

    x.map((xi, i) => {
      var frameIdx = Math.floor(xi * this.nframes / 1000);
      var frame = this.frames[frameIdx];
      if (frame == undefined) return
      // frame.data[frame.data.length - 1].x.push(frame.data.length - 1)
      frame.data[frame.data.length - 1].x.push(x[i])
      frame.data[frame.data.length - 1].y.push(y[i])
      frame.data[frame.data.length - 1].z.push(z[i])
    })

  }

  scatter3d(idx, x, y, z, color, config = {}, yaxis = 'y2') {
    return {
      mode: 'markers',
      type: 'scatter3d',
      idx: idx,
      x: x,
      y: y,
      z: z,
      hoverinfo: 'none',
      showlegend: false,
      opacity: .6,
      marker: {
        size: 2,
        color: color,
      },
      yaxis: yaxis
    }
  }

  histogram(idx, x, start = 0., end = 1000., size = 10., color, label = '', config = {}, yaxis = 'y1') {
    return {
      type: 'histogram',
      idx: idx,
      source: 'x',
      x: x,
      histfunc: 'count',
      text: 'auto',
      // name: 'PSTH of ' + (idx + 1),
      name: '',
      legendgroup: 'spikes' + (idx + 1),
      hoverinfo: config['hoverinfo'] || 'y',
      showlegend: config['showlegend'] != undefined ? config['showlegend'] : false,
      opacity: config['opacity'] || .6,
      xbins: {
        start: start,
        end: end+size,
        size: size,
      },
      marker: {
        color: color,
        line: {
          color: 'white',
          width: 1,
        }
      },
      yaxis: yaxis
    }
  }

  hasSpikeData() {
    var records = this.records.filter(record => record.recorder.model == 'spike_detector');
    return records.length > 0;
  }

  hasAnalogData() {
    var records = this.records.filter(record => ['multimeter', 'voltmeter'].includes(record.recorder.model));
    return records.length > 0;
  }

  hasInputData(idx = null) {
    var collections = this.data.simulation.collections;
    if (idx) {
      var node = this.data.app.nodes[idx];
      var connectomes = this.data.simulation.connectomes.filter(connectome => {
        var post = collections[connectome.post];
        return connectome.pre == idx && post.element_type == 'stimulator'
      })
    } else {
      var connectomes = this.data.simulation.connectomes.filter(connectome => {
        var pre = collections[connectome.pre];
        var post = collections[connectome.post];
        return pre.element_type == 'recorder' && post.element_type == 'stimulator';
      })
    }
    return connectomes.length > 0;
  }

  onLegendClick(event) {
    setTimeout(() => {
      this.threshold = event.data[0]['visible'];
    }, 1000)
  }

  onLegendDoubleClick(event) {
    // console.log(event)
  }

  onSelect(event) {
    var histograms = this._data.filter(d => d.type == 'histogram' && d.source == 'x');
    histograms.forEach(h => {
      var x = this.records[h.idx].events.times;
      var points = event.points.filter(p => p.data.idx == h.idx);
      h.x = points.map(p => x[p.pointIndex]);
    })
  }

}
