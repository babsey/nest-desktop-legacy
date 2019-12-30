import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';

import { ChartRecordsService } from './chart-records.service';
import { ColorService } from '../../../network/services/color.service';
import { MathService } from '../../../services/math/math.service';
import { LogService } from '../../../log/log.service';
import { VisualizationService } from '../../visualization.service';

import { Data } from '../../../classes/data';
import { AppNode } from '../../../classes/appNode';
import { Record } from '../../../classes/record';


@Component({
  selector: 'app-chart-records',
  templateUrl: './chart-records.component.html',
  styleUrls: ['./chart-records.component.scss']
})
export class ChartRecordsComponent implements OnInit, OnDestroy {
  @Input() data: Data;
  @Input() records: Record[];
  @ViewChild('plot', { static: true }) plotRef: ElementRef;
  public plotlyData: any[] = [];
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
  private labels: string = 'abcdefghijklmnopqrstuvwxyz';

  constructor(
    private _logService: LogService,
    private _mathService: MathService,
    public _chartRecordsService: ChartRecordsService,
    public _visualizationService: VisualizationService,
    public _colorService: ColorService,
  ) {
  }

  ngOnInit() {
    // console.log('Record visualization on init')
    this.subscription = this._visualizationService.update.subscribe(() => this.update())
    this.init()
  }

  ngOnDestroy() {
    this.plot.parentNode.removeChild(this.plot);
    this.subscription.unsubscribe()
  }

  private get plot(): HTMLCanvasElement {
    return this.plotRef['plotEl'].nativeElement;
  }

  init(): void {
    // console.log('Init records visualization')
    this.config = {
      scrollZoom: true,
      editable: true,
      // displayModeBar: true,
      displaylogo: false,
      responsive: true,
      // showLink: true,
      toImageButtonOptions: {
        format: 'svg', // one of png, svg, jpeg, webp
        filename: 'nest_desktop-' + this.data.name,
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
    this.update()
  }

  update(): void {
    // console.log('Update records visualization')
    this.plotlyData = [];
    var records = this.records;
    if (records.length == 0) return
    this._logService.log('Update charts');

    var barmode = this._chartRecordsService['barmode'];
    var barnorm = this._chartRecordsService['barnorm'];
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
        this.layout['yaxis2'] = {
          domain: [.21, .84],
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
    }

    if (this.hasSpikeData()) {
      this.layout['barmode'] = barmode;
      this.layout['barnorm'] = barnorm;
    }

    records.map(record => {
      if (record.recorder.model == 'spike_detector') {
        this.plotSpikeData(record)
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
    if (this.layout.hasOwnProperty('yaxis2')) {
      if (this.layout.yaxis2.hasOwnProperty('range')) {
        this.layout.yaxis2.range[0] -= 1;
        this.layout.yaxis2.range[1] += 1;
      }
    }
    this._logService.log('Render charts');
  }

  plotSpikeData(record: Record): void {
    var x: any[] = record.events.times;
    var y: any[] = record.events.senders;

    var start: number = 0.;
    var end: number = this.data.app.kernel['time'];
    var size: number = this._chartRecordsService.binsize;
    var node = this.data.app.nodes[record.recorder.idx];
    var color: string = this._colorService.node(node);

    var idx = this.plotlyData.length;
    var label = this.labels[node.idx];
    record.config['showlegend'] = this.records.length > 1;
    record.config['legendgroup'] = 'spike' + idx;

    var scatterData = this._chartRecordsService.scatter(record.idx, x, y, color, label, record.config);
    var histData = this._chartRecordsService.histogram(record.idx, x, start, end, size, color, record.config)
    this.plotlyData.push(scatterData);
    this.plotlyData.push(histData);

    var global_ids: number[];
    if (this.layout.yaxis2.hasOwnProperty('range')) {
      global_ids = this.layout.yaxis2['range'].concat(record['global_ids']);
    } else {
      global_ids = record['global_ids'];
    }
    this.layout.yaxis2['range'] = this._mathService.extent(global_ids);
  }

  plotAnalogData(record: Record, record_from: string = 'V_m'): void {
    if (record_from == 'V_m') {
      var time = this.data.app.kernel['time'] || 1000;
      var Vth = -55;

      var x: any[] = [0, time];
      var y: any[] = [Vth, Vth];

      var config = { hoverinfo: 'none', visible: 'legendonly', 'line.dash': 'dash' };
      var plot_Vth = this._chartRecordsService.plot(record.idx, x, y, 'black', 'V_m threshold', config);
      this.plotlyData.push(plot_Vth)
    }

    var recorder = record.recorder;
    var node = this.data.app.nodes[recorder.idx];
    var color: string = this._colorService.node(node);

    if (record_from == 'V_m') {
      this.plotlyData[0]['showlegend'] = true;
      this.plotlyData[0]['visible'] = this.threshold;
    }

    var neurons = this.data.simulation.connectomes
      .filter(d => d.source == recorder.idx)
      .map(d => this.data.simulation.collections[d.target]);

    var senders = record['senders'];
    var data = senders.map(sender => { return { x: [], y: [] } });
    record.events['senders'].forEach((sender, idx) => {
      if (!record.events.hasOwnProperty(record_from)) return
      var senderIdx = senders.indexOf(sender);
      data[senderIdx].x.push(record.events['times'][idx])
      data[senderIdx].y.push(record.events[record_from][idx])
    })

    var yaxis = this.hasInputData(recorder.idx) ? 'y4' : 'y3';
    if (data.length == 1) {
      var label = record_from + ' of ' + (recorder.idx + 1);
      var config0 = { hoverinfo: 'full', showlegend: true };
      var plot = this._chartRecordsService.plot(recorder.idx, data[0].x, data[0].y, color, label, config0, yaxis);
      this.plotlyData.push(plot)
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
      var plot = this._chartRecordsService.plot(recorder.idx, x, y, color, label, config1, yaxis);
      this.plotlyData.push(plot)

      data.slice(0, 1).map(d => {
        var label = record_from + ' of [' + senders[0] + ' - ' + senders[senders.length - 1] + ']';
        var config2 = {
          legendgroup: record_from + (record.idx + 1),
          hoverinfo: 'none',
          opacity: 0.5,
        }
        var plot = this._chartRecordsService.plot(recorder.idx, d.x, d.y, color, label, config2, yaxis);
        this.plotlyData.push(plot)
      })

      data.slice(1, 3).map(d => {
        var config3 = {
          legendgroup: record_from + (record.idx + 1),
          showlegend: false,
          hoverinfo: 'none',
          opacity: 0.3,
        }
        var plot = this._chartRecordsService.plot(recorder.idx, d.x, d.y, color, label, config3, yaxis);
        this.plotlyData.push(plot)
      })

      data.slice(3, 20).map(d => {
        var config4 = {
          legendgroup: record_from + (record.idx + 1),
          showlegend: false,
          hoverinfo: 'none',
          opacity: 0.1,
        }
        var plot = this._chartRecordsService.plot(recorder.idx, d.x, d.y, color, label, config4, yaxis);
        this.plotlyData.push(plot)
      })

    }
  }

  hasSpikeData(): boolean {
    var records = this.records.filter(record => record.recorder.model == 'spike_detector');
    return records.length > 0;
  }

  hasAnalogData(): boolean {
    var records = this.records.filter(record => ['multimeter', 'voltmeter'].includes(record.recorder.model));
    return records.length > 0;
  }

  hasInputData(idx: number = null): boolean {
    var collections = this.data.simulation.collections;
    if (idx) {
      var node = this.data.app.nodes[idx];
      var connectomes = this.data.simulation.connectomes.filter(connectome => {
        var target = collections[connectome.target];
        return connectome.source == idx && target.element_type == 'stimulator'
      })
    } else {
      var connectomes = this.data.simulation.connectomes.filter(connectome => {
        var source = collections[connectome.source];
        var target = collections[connectome.target];
        return source.element_type == 'recorder' && target.element_type == 'stimulator';
      })
    }
    return connectomes.length > 0;
  }

  onLegendClick(event: any): void {
    setTimeout(() => {
      var idx = event.curveNumber;
      var data = event.data[idx];
      this.records[data.idx].config['visible'] = data['visible'];
    }, 1000)
  }

  onLegendDoubleClick(event: any): void {
    // console.log(event)
  }

  onSelect(event: any): void {
    var histograms = this.plotlyData.filter(d => d.type == 'histogram' && d.source == 'x');
    histograms.forEach(h => {
      var x = this.records[h.idx].events.times;
      var points = event.points.filter(p => p.data.idx == h.idx);
      h.x = points.map(p => x[p.pointIndex]);
    })
  }

}
