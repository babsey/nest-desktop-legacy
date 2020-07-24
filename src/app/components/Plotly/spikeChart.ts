import { Activity } from '../activity';


export class SpikeChart {
  activity: Activity;                     // parent

  data: any[] = [];
  layout: any = {};

  constructor(activity: Activity) {
    this.activity = activity;
    this.init();
    this.updateColor();
    this.updateEvents();
  }

  init(): void {
    this.initScatter();
    this.initHistogram();
  }

  updateColor(): void {
    this.data.forEach(d => d.marker.color = this.activity.recorder.view.color);
  }

  updateEvents(): void {
    this.updateScatter();
    this.updateHistogram();
  }

  initScatter(): void {
    this.data.push({
      activityIdx: this.activity.idx,
      idx: this.data.length,
      mode: 'markers',
      type: 'scattergl',
      x: [],
      y: [],
      marker: {
        size: 5,
        color: 'black',
      },
      hoverinfo: 'x',
      legendgroup: 'spikes' + this.activity.idx,
      showlegend: true,
      yaxis: 'y2',
    });
  }

  updateScatter(): void {
    const scatterData: any = this.data[0];
    scatterData.x = this.activity.recorder.events.times;
    scatterData.y = this.activity.recorder.events.senders;
  }

  initHistogram(): any {
    this.data.push({
      activityIdx: this.activity.idx,
      idx: this.data.length,
      type: 'histogram',
      source: 'x',
      x: [],
      histfunc: 'count',
      text: 'auto',
      legendgroup: 'spikes' + this.activity.idx,
      hoverinfo: 'y',
      visible: true,
      showlegend: false,
      opacity: .6,
      xbins: {
        start: 0,
        end: 1000,
        size: 50,
      },
      marker: {
        color: 'black',
        line: {
          color: 'white',
          width: 1,
        }
      }
    });
  }

  updateHistogram(): void {
    const histogramData: any = this.data[1];

    const start: number = 0;
    const end: number = this.activity.endtime;
    const size: number = histogramData.xbins.size;

    histogramData.x = this.activity.recorder.events.times;
    histogramData.xbins.end = end + size;
    histogramData.marker.line.width = (end - start) / size > 100 ? 0 : 1;
  }

}
