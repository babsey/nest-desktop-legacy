import { Activity } from '../activity';
import { ActivityChartGraph } from './activityChartGraph';
import { Panel } from './panel';


export class AnalogLines extends Panel {

  constructor(graph: ActivityChartGraph) {
    super('AnalogLines', graph);
    this.init();
  }

  init(): void {
    this.data = [];
    this.activities.map(activity => {
      const recordables: string[] = Object.keys(activity.events).filter(d => !['times', 'senders'].includes(d));
      recordables.forEach(recordFrom => {
        if (recordFrom === 'V_m') {
          this.addSpikeThresholdLine(activity);
        }
        if (activity.nodeIds.length === 1) {
          this.addSingleLine(activity, recordFrom);
        } else {
          this.addMultipleLines(activity, recordFrom);
          this.addAverageLine(activity, recordFrom);
        }
      });
    })
  }

  update(): void {
    this.init();
    this.activities.forEach(activity => {
      const recordables: string[] = Object.keys(activity.events)
        .filter(d => !['times', 'senders'].includes(d));
      recordables.forEach(recordFrom => {
        if (recordFrom === 'V_m') {
          this.updateSpikeThresholdLine(activity);
        }
        if (activity.nodeIds.length === 1) {
          this.updateSingleLine(activity, recordFrom);
        } else {
          this.updateMultipleLines(activity, recordFrom);
          this.updateAverageLine(activity, recordFrom);
        }
      });
    })
  }

  updateColor(): void {
    this.activities.forEach(activity => {
      const data: any = this.data.find(d => d.activityIdx === activity.idx);
      data.line.color = activity.recorder.view.color;
    })
  }

  addSpikeThresholdLine(activity: Activity): void {
    const thresholds: number[] = activity.recorder.nodes.map(target => target.getParameter('V_th'));
    const threshold: number = (thresholds.length > 0) ? thresholds[0] : -55.;
    this.data.push({
      activityIdx: activity.idx,
      id: 'threshold',
      mode: 'lines',
      type: 'scattergl',
      showlegend: true,
      hoverinfo: 'none',
      name: 'Spike threshold',
      opacity: .5,
      visible: 'legendonly',
      line: {
        color: 'black',
        dash: 'dot',
        width: 2,
      },
      x: [0, activity.endtime],
      y: [threshold, threshold],
    })
  }

  updateSpikeThresholdLine(activity: Activity): void {
    const data = this.data.find(d => d.activityIdx === activity.idx && d.id === 'threshold')
    const thresholds: number[] = activity.recorder.nodes.map(target => target.getParameter('V_th'));
    const threshold: number = (thresholds.length > 0) ? thresholds[0] : -55.;
    data.y = [threshold, threshold];
    data.line.color = activity.recorder.view.color;
  }

  addSingleLine(activity: Activity, recordFrom: string): void {
    this.data.push({
      activityIdx: activity.idx,
      id: recordFrom,
      mode: 'lines',
      type: 'scattergl',
      name: '',
      hoverinfo: 'all',
      showlegend: true,
      visible: true,
      line: {
        color: 'black',
        width: 1.5,
      },
      x: [],
      y: [],
    });
  }

  updateSingleLine(activity: Activity, recordFrom: string): void {
    const data: any = this.data.find(d => d.activityIdx === activity.idx && d.id === recordFrom);
    data.x = activity.events.times;
    data.y = activity.events[recordFrom];
    data.name = recordFrom + ' of ' + activity.senders[0];
    data.line.color = activity.recorder.view.color;
  }

  addMultipleLines(activity: Activity, recordFrom: string): void {
    activity.senders.slice(0,100).forEach((sender, idx) => {
      this.data.push({
        activityIdx: activity.idx,
        legendgroup: recordFrom + '_group',
        mode: 'lines',
        type: 'scattergl',
        hoverinfo: 'none',
        name: '',
        opacity: idx === 0 ? 0.5 : 0.3,
        showlegend: idx === 0,
        line: {
          color: 'black',
          width: 1,
        },
        x: [],
        y: [],
      });
    })
  }

  updateMultipleLines(activity: Activity, recordFrom: string): void {
    const data: any = this.data.filter(d => d.activityIdx === activity.idx && d.legendgroup === recordFrom + '_group');
    const senders: number[] = activity.senders.slice(0,100);
    const events: any[] = senders.map(sender => { return { x: [], y: [] } });

    activity.events.senders.forEach((sender: number, idx: number) => {
      if (!activity.events.hasOwnProperty(recordFrom)) return
      const senderIdx: number = senders.indexOf(sender);
      if (senderIdx === -1) return
      events[senderIdx].x.push(activity.events.times[idx]);
      events[senderIdx].y.push(activity.events[recordFrom][idx]);
      events[senderIdx]['name'] = recordFrom + ' of [' + senders[0] + ' - ' + senders[senders.length - 1] + ']';
    })

    data.forEach((d: any, idx: number) => {
      d.x = events[idx].x;
      d.y = events[idx].y;
      d.name = events[idx].name;
      d.line.color = activity.recorder.view.color;
    })

  }

  addAverageLine(activity: Activity, recordFrom: string): void {
    // white background for average line
    this.data.push({
      activityIdx: activity.idx,
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
      activityIdx: activity.idx,
      recordFrom: recordFrom,
      mode: 'lines',
      type: 'scattergl',
      name: recordFrom + ' average',
      legendgroup: recordFrom + '_avg',
      hoverinfo: 'all',
      showlegend: true,
      line: {
        width: 1.5,
        color: 'black',
      },
      x: [],
      y: [],
    });
  }

  updateAverageLine(activity: Activity, recordFrom: string): void {
    const data: any[] = this.data.filter(d => d.activityIdx === activity.idx && d.legendgroup === recordFrom + '_avg');
    const senders: number[] = activity.senders;
    const events: any[] = senders.map(sender => { return { x: [], y: [] } });

    activity.events.senders.forEach((sender: number, idx: number) => {
      if (!activity.events.hasOwnProperty(recordFrom)) return
      const senderIdx: number = senders.indexOf(sender);
      events[senderIdx].x.push(activity.events.times[idx]);
      events[senderIdx].y.push(activity.events[recordFrom][idx]);
      events[senderIdx]['name'] = recordFrom + ' of [' + senders[0] + ' - ' + senders[senders.length - 1] + ']';
    })

    const x: any[] = events[0].x;
    const y: any[] = x.map((d, i) => {
      const yi: any[] = [];
      senders.forEach((sender, idx) => yi.push(events[idx].y[i]));
      const sum: number = yi.reduce((a, b) => (a + b));
      const avg: number = sum / senders.length;
      return avg;
    })

    data.forEach(d => {
      d.x = x;
      d.y = y;
    })

    data[1].line.color = activity.recorder.view.color;
  }

}
