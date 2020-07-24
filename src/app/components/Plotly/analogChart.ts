import { Activity } from '../activity';


export class AnalogChart {
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
    const recordables: string[] = Object.keys(this.activity.recorder.events).filter(d => !['times', 'senders'].includes(d));
    recordables.forEach(recordFrom => {
      if (recordFrom === 'V_m') {
        this.initSpikeThreshold();
      }
      (this.activity.nodeIds.length === 1) ? this.initSingleEvent(recordFrom) : this.initMultipleEvents(recordFrom);
    });
  }

  updateColor(): void {
    this.data.forEach(d => d.line.color = this.activity.recorder.view.color);
  }

  updateEvents(): void {
    const recordables: string[] = Object.keys(this.activity.recorder.events).filter(d => !['times', 'senders'].includes(d));
    recordables.forEach(recordFrom => {
      if (recordFrom === 'V_m') {
        this.updateSpikeThreshold();
      }
      (this.activity.nodeIds.length === 1) ? this.updateSingleEvent(recordFrom) : this.updateMultipleEvents(recordFrom);
    });
  }

  initSpikeThreshold(): void {
    const thresholds: number[] = this.activity.recorder.nodes.map(target => target.getParameter('V_th'));
    const threshold: number = (thresholds.length > 0) ? thresholds[0] : -55.;

    this.data.push({
      activityIdx: this.activity.idx,
      idx: this.data.length,
      id: 'threshold',
      recordFrom: 'V_m',
      mode: 'lines',
      type: 'scattergl',
      showlegend: true,
      hoverinfo: 'none',
      name: 'Spike threshold',
      opacity: .5,
      visible: 'legendonly',
      line: {
        dash: 'dot',
        width: 2,
        color: 'black',
      },
      x: [0, this.activity.endtime],
      y: [threshold, threshold],
    })
  }

  updateSpikeThreshold(): void {
    const thresholds: number[] = this.activity.recorder.nodes.map(target => target.getParameter('V_th'));
    const threshold: number = (thresholds.length > 0) ? thresholds[0] : -55.;
    const d = this.data.find(d => d.id === 'threshold');
    d.y = [threshold, threshold];
  }

  initSingleEvent(recordFrom: string): void {
    this.data.push({
      activityIdx: this.activity.idx,
      idx: this.data.length,
      id: recordFrom,
      recordFrom: recordFrom,
      mode: 'lines',
      type: 'scattergl',
      name: '',
      hoverinfo: 'all',
      showlegend: true,
      visible: true,
      line: {
        width: 1.5,
        color: 'black',
      },
      x: [],
      y: [],
    });
  }

  updateSingleEvent(recordFrom: string): void {
    const d: any = this.data.find(d => d.id === recordFrom);
    d.x = this.activity.recorder.events.times;
    d.y = this.activity.recorder.events[recordFrom];
    d.name = recordFrom + ' of ' + this.activity.recorder.senders[0];
  }

  initMultipleEvents(recordFrom: string): void {

    // representative line
    this.data.push({
      activityIdx: this.activity.idx,
      idx: this.data.length,
      recordFrom: recordFrom,
      mode: 'lines',
      type: 'scattergl',
      hoverinfo: 'none',
      legendgroup: recordFrom + '_group',
      name: '',
      opacity: 0.5,
      showlegend: true,
      line: {
        width: 1,
        color: 'black',
      },
      x: [],
      y: [],
    });

    // background lines
    this.activity.recorder.senders.forEach(sender => {
      this.data.push({
        activityIdx: this.activity.idx,
        idx: this.data.length,
        recordFrom: recordFrom,
        mode: 'lines',
        type: 'scattergl',
        hoverinfo: 'none',
        legendgroup: recordFrom + '_group',
        name: '',
        opacity: 0.3,
        showlegend: false,
        line: {
          width: 1,
          color: 'black',
        },
        x: [],
        y: [],
      });
    })

    // white background for average line
    this.data.push({
      activityIdx: this.activity.idx,
      idx: this.data.length,
      recordFrom: recordFrom,
      mode: 'lines',
      type: 'scattergl',
      hoverinfo: 'none',
      legendgroup: recordFrom + '_avg',
      showlegend: false,
      line: {
        width: 8,
        color: 'white'
      },
      x: [],
      y: [],
    });

    // average line
    this.data.push({
      activityIdx: this.activity.idx,
      idx: this.data.length,
      recordFrom: recordFrom,
      mode: 'lines',
      type: 'scattergl',
      name: recordFrom + ' average',
      legendgroup: recordFrom + '_avg',
      hoverinfo: 'all',
      showlegend: true,
      line: {
        width: 1.5,
        color: 'white'
      },
      x: [],
      y: [],
    });
  }

  updateMultipleEvents(recordFrom: string): void {
    const events: any = this.activity.recorder.events;
    const senders: number[] = this.activity.recorder.senders;
    const data: any[] = senders.map(sender => { return { x: [], y: [] } });

    events.senders.forEach((sender, idx) => {
      if (!events.hasOwnProperty(recordFrom)) return
      const senderIdx: number = senders.indexOf(sender);
      data[senderIdx].x.push(events.times[idx]);
      data[senderIdx].y.push(events[recordFrom][idx]);
      data[senderIdx]['name'] = recordFrom + ' of [' + senders[0] + ' - ' + senders[senders.length - 1] + ']';
    })

    this.data.filter(d => d.legendgroup === recordFrom + '_group').forEach((d, idx) => {
      d.x = data[idx].x;
      d.y = data[idx].y;
      d.name = data[idx].name;
    })

    let x: any[] = data[0].x;
    let y: any[] = x.map((d, i) => {
      const yi: any[] = [];
      senders.forEach((sender, idx) => yi.push(data[idx].y[i]));
      const sum: number = yi.reduce((a, b) => (a + b));
      const avg: number = sum / senders.length;
      return avg;
    })

    this.data.filter(d => d.legendgroup === recordFrom + '_avg').forEach(d => {
      d.x = x;
      d.y = y;
    })

  }

}
