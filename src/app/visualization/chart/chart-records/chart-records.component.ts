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
  private subscriptionUpdate: any;
  private subscriptionInit: any;
  public sizes: number[] = [80, 20];

  constructor(
    private _logService: LogService,
    private _mathService: MathService,
    public _chartRecordsService: ChartRecordsService,
    public _visualizationService: VisualizationService,
    public _colorService: ColorService,
  ) {
  }

  ngOnInit(): void {
    // console.log('Record visualization on init')
    this._chartRecordsService.panelSelected = [];
    if (this.hasInputData()) {
      this._chartRecordsService.panelSelected.push('input')
    }
    if (this.hasAnalogData()) {
      this._chartRecordsService.panelSelected.push('analog')
    }
    if (this.hasSpikeData()) {
      this._chartRecordsService.panelSelected.push('spike')
      this._chartRecordsService.panelSelected.push('histogram')
    }

    this.subscriptionInit = this._visualizationService.init.subscribe(() => this.init())
    this.subscriptionUpdate = this._visualizationService.update.subscribe(() => this.update())
    this.init()
  }

  ngOnDestroy(): void {
    this.plot.parentNode.removeChild(this.plot);
    this.subscriptionInit.unsubscribe()
    this.subscriptionUpdate.unsubscribe()
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
      toImageButtonOptions: this._chartRecordsService.toImageButtonOptions,
      modeBarButtons: [
        // "zoom2d", "pan2d", "select2d", "lasso2d", "zoomIn2d", "zoomOut2d", "autoScale2d", "resetScale2d", "hoverClosestCartesian", "hoverCompareCartesian", "zoom3d", "pan3d", "resetCameraDefault3d", "resetCameraLastSave3d", "hoverClosest3d", "orbitRotation", "tableRotation", "zoomInGeo", "zoomOutGeo", "resetGeo", "hoverClosestGeo", "toImage", "sendDataToCloud", "hoverClosestGl2d", "hoverClosestPie", "toggleHover", "resetViews", "toggleSpikelines", "resetViewMapbox"
        // [this._chartRecordsService.imageButtonOptions, "toImage"],
        ['toImage'],
        ['zoom2d', 'pan2d', 'select2d', 'lasso2d'],
        ['zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d'],
        ['toggleSpikelines', 'hoverClosestCartesian', 'hoverCompareCartesian']
      ]
    };

    this.initLayout()
    this.update()
  }

  initLayout(): void {
    this._chartRecordsService.panelInit()
    this._chartRecordsService.setPanelSizes()

    this.layout = {
      title: {
        text: this.data.name,
        xref: 'paper',
        x: 0.05,
      },
      xaxis: {
        title: 'Time [ms]',
        showgrid: true,
        zeroline: true,
      },
    };

  }

  update(): void {
    // console.log('Update records visualization')
    this.plotlyData = [];
    var records = this.records;
    if (records.length == 0) return
    this._logService.log('Update charts');
    this._chartRecordsService.panel.analog.threshold = false;
    this.updateLayout()
    records.map(record => {
      if (record.recorder.model == 'spike_detector') {
        this.plotSpikeData(record)
      } else {
        var node = this.data.app.nodes[record.recorder.idx];
        if (node == undefined) return
        var model = this.data.simulation.models[this.data.simulation.collections[record.recorder.idx].model]
        if (model.params.hasOwnProperty('record_from')) {
          model.params.record_from.map(recordFrom => this.plotAnalogData(record, recordFrom))
        } else {
          this.plotAnalogData(record)
        }
      }
    })

    // var panel = this._chartRecordsService.panel['spike'];
    // var yaxis = 'yaxis' + (panel.yaxis == 1 ? '' : panel.yaxis);
    // if (this.layout.hasOwnProperty(yaxis)) {
    //   if (this.layout[yaxis].hasOwnProperty('range')) {
    //     this.layout[yaxis].range[0] -= 1;
    //     this.layout[yaxis].range[1] += 1;
    //   }
    // }

    this._logService.log('Render charts');
  }

  updateLayout(): void {
    var sizes = this._chartRecordsService.panelOrder
      .filter(pp => this._chartRecordsService.panelSelected.includes(pp))
      .map(p => (this._chartRecordsService.panel[p].size / 100));
    sizes.reverse()
    const cumulativeSum = (sum => value => sum += value)(0);
    var sizesCumSum = sizes.map(cumulativeSum);
    var domains = sizesCumSum.map((s, i) => {
      var start = (i == 0) ? 0 : (sizesCumSum[i - 1] + 0.02);
      var end = (i == sizesCumSum.length - 1) ? 1 : (s - 0.02);
      return [start, end]
    })
    domains.reverse()

    this._chartRecordsService.panelOrder
      .filter(pp => this._chartRecordsService.panelSelected.includes(pp))
      .map((p, i) => {
        var panel = this._chartRecordsService.panel[p];
        var domain = domains[i];
        var yaxis = 'yaxis' + (panel.yaxis == 1 ? '' : panel.yaxis);
        this.layout[yaxis] = {
          title: panel.ylabel,
          domain: domain,
          // zeroline: this._chartRecordsService.panelSelected.length == 1 || panel.yaxis == 1,
        }
      })

    if (this._chartRecordsService.panelSelected.includes('histogram')) {
      this.layout['barmode'] = this._chartRecordsService['barmode'];
      this.layout['barnorm'] = this._chartRecordsService['barnorm'];
    }
  }

  color(idx: number): string {
    return this._colorService.node(idx);
  }

  plotSpikeData(record: Record): void {
    var x: any[] = record.events.times;
    var y: any[] = record.events.senders;

    var start: number = 0.;
    var end: number = this.data.app.kernel['time'];
    var size: number = this._chartRecordsService.binsize;
    var color: string = this.color(record.recorder.idx);

    var idx = this.plotlyData.length;
    var label = this.data.simulation.collections[idx].model.split('-')[1];

    if (!record.config.hasOwnProperty('spike')) {
      record.config['spike'] = {
        showlegend: false,
        legendgroup:  'spike' + idx,
      }
    }

    if (this._chartRecordsService.panelSelected.includes('spike') && this._chartRecordsService.panel['spike'].size > 2) {
      var panelSpike = this._chartRecordsService.panel['spike'];
      var scatterData = this._chartRecordsService.scatter(record.idx, x, y, color, label, record.config['spike'], 'y' + panelSpike.yaxis);
      this.plotlyData.push(scatterData);

      var yaxis = 'yaxis' + (panelSpike.yaxis == 1 ? '' : panelSpike.yaxis);
      var global_ids: number[];
      if (this.layout[yaxis].hasOwnProperty('range')) {
        global_ids = this.layout[yaxis]['range'].concat(record['global_ids']);
      } else {
        global_ids = record['global_ids'];
      }
      this.layout[yaxis]['range'] = this._mathService.extent(global_ids);
    }

    if (this._chartRecordsService.panelSelected.includes('histogram') && this._chartRecordsService.panel['histogram'].size > 2) {
      var panelHist = this._chartRecordsService.panel['histogram'];
      var histData = this._chartRecordsService.histogram(record.idx, x, start, end, size, color, record.config, 'y' + panelHist.yaxis);
      this.plotlyData.push(histData);
    }

  }

  plotAnalogData(record: Record, record_from: string = 'V_m'): void {
    var recorder = record.recorder;
    var panelSource = this.hasInputData(recorder.idx) ? 'input' : 'analog';
    var panel = this._chartRecordsService.panel[panelSource];
    if (panel.size <= 2) return
    var yaxis = 'y' + panel.yaxis;

    var color: string = this.color(record.recorder.idx);
    var connectomes = this.data.simulation.connectomes.filter(d => d.source == recorder.idx);
    if (connectomes.length == 0) return
    var node = this.data.simulation.collections[connectomes[0].target];
    var model = this.data.simulation.models[node.model];

    if (record_from == 'V_m' && model.params.hasOwnProperty('V_th')) {
      var time = this.data.app.kernel['time'] || 1000;
      var Vth = model.params['V_th'] || -55.;
      var x: any[] = [0, time];
      var y: any[] = [Vth, Vth];
      var idx = 'V_th'
      if (!record.config.hasOwnProperty(idx)) {
        record.config[idx] = {
          idx: idx,
          name: 'Spike threshold',
          hoverinfo: 'none',
          'line.dash': 'dot',
          visible: 'legendonly',
          'line.width': 2,
          opacity: .5,
          color: color,
          record_from: record_from,
        };
      }
      record.config[idx].color = color;
      var plot_Vth = this._chartRecordsService.plot(record.idx, x, y, record.config[idx], yaxis);
      this.plotlyData.push(plot_Vth)
    }

    var senders = record['senders'];
    var data = senders.map(sender => { return { x: [], y: [] } });
    record.events['senders'].forEach((sender, idx) => {
      if (!record.events.hasOwnProperty(record_from)) return
      var senderIdx = senders.indexOf(sender);
      data[senderIdx].x.push(record.events['times'][idx])
      data[senderIdx].y.push(record.events[record_from][idx])
    })

    if (data.length == 1) {
      var d = data[0];
      var idx = record_from;
      if (!record.config.hasOwnProperty(idx)) {
        record.config[idx] = {
          idx: idx,
          showlegend: true,
          visible: true,
          name: record_from + ' of ' + senders[0],
          color: color,
          record_from: record_from,
        };
      }
      record.config[idx].color = color;
      var plot = this._chartRecordsService.plot(record.idx, d.x, d.y, record.config[idx], yaxis);
      this.plotlyData.push(plot)

    } else if (data.length > 1) {

      var legendgroup = record.idx + '_' + record_from + '_group';
      var d = data[0];
      var idx = record_from + '_first';
      if (!record.config.hasOwnProperty(idx)) {
        record.config[idx] = {
          'line.width': 1,
          color: color,
          hoverinfo: 'none',
          idx: idx,
          legendgroup: legendgroup,
          name: record_from + ' of [' + senders[0] + ' - ' + senders[senders.length - 1] + ']',
          opacity: 0.5,
          record_from: record_from,
        };
      }
      record.config[idx].color = color;
      var plot = this._chartRecordsService.plot(record.idx, d.x, d.y, record.config[idx], yaxis);
      this.plotlyData.push(plot)

      var idx = record_from + '_group';
      if (!record.config.hasOwnProperty(idx)) {
        record.config[idx] = {
          'line.width': 1,
          color: color,
          hoverinfo: 'none',
          idx: idx,
          legendgroup: legendgroup,
          name: record_from + ' of [' + senders[0] + ' - ' + senders[senders.length - 1] + ']',
          opacity: 0.3,
          record_from: record_from,
          showlegend: false,
        };
      }
      record.config[idx].color = color;
      data.map((d, i) => {
        var plot = this._chartRecordsService.plot(record.idx, d.x, d.y, record.config[idx], yaxis);
        this.plotlyData.push(plot)
      })


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

      var idx = record_from + '_avg_bg';
      if (!record.config.hasOwnProperty(idx)) {
        record.config[idx] = {
          hoverinfo: 'none',
          idx: idx,
          'line.width': 8,
          color: 'white',
          legendgroup: legendgroup,
          showlegend: false,
          yaxis: yaxis,
        };
      }
      var plot = this._chartRecordsService.plot(record.idx, x, y, record.config[idx], yaxis);
      this.plotlyData.push(plot)

      var idx = record_from + '_avg';
      if (!record.config.hasOwnProperty(idx)) {
        record.config[idx] = {
          idx: idx,
          color: color,
          name: record_from + ' average',
          yaxis: yaxis,
        };
      }
      record.config[idx].color = color;
      var plot = this._chartRecordsService.plot(record.idx, x, y, record.config[idx], yaxis);
      this.plotlyData.push(plot)
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
      var data = event.data[event.curveNumber];
      var record = this.records[data._source.recordIdx]
      var config = record.config[data._source.plotConfigIdx];
      config['visible'] = data.visible;
      console.log(data, config)
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
