import * as PlotlyJS from 'plotly.js-cartesian-dist';

import { Project } from '../../project/project';
import { ActivityGraph } from '../activityGraph';

import { Panel } from './panel';
import { ModelAnalogLines } from './modelAnalogLines';
import { NeuronAnalogLines } from './neuronAnalogLines';
import { InputAnalogLines } from './inputAnalogLines';
import { SpikeScatter } from './spikeScatter';
import { SpikeHistogram } from './spikeHistogram';


export class ActivityChartGraph extends ActivityGraph {

  panels: any[] = [];
  registerPanels: any[][] = [
    ['Analog from stimulator', (graph: ActivityChartGraph) => new InputAnalogLines(graph)],
    ['Analog from neurons', (graph: ActivityChartGraph) => new NeuronAnalogLines(graph)],
    ['Spike scatter', (graph: ActivityChartGraph) => new SpikeScatter(graph)],
    ['Histogram of spikes', (graph: ActivityChartGraph) => new SpikeHistogram(graph)],
  ];

  layout: any = {
    margin: {
      t: 40,
    },
    title: {
      text: '',
      xref: 'paper',
      x: 0,
    },
    xaxis: {
      title: 'Time [ms]',
      showgrid: true,
      zeroline: true,
    }
  };

  config: any = {
    scrollZoom: true,
    editable: true,
    // displayModeBar: true,
    displaylogo: false,
    responsive: true,
    // showLink: true,
    toImageButtonOptions: {
      format: 'svg', // png, svg, jpeg, webp
      width: 800,
      height: 600,
      scale: 1, // Multiply title/legend/axis/canvas sizes by this factor
    },
    modeBarButtons: [
      // "zoom2d", "pan2d", "select2d", "lasso2d", "zoomIn2d", "zoomOut2d", "autoScale2d", "resetScale2d", "hoverClosestCartesian", "hoverCompareCartesian", "zoom3d", "pan3d", "resetCameraDefault3d", "resetCameraLastSave3d", "hoverClosest3d", "orbitRotation", "tableRotation", "zoomInGeo", "zoomOutGeo", "resetGeo", "hoverClosestGeo", "toImage", "sendDataToCloud", "hoverClosestGl2d", "hoverClosestPie", "toggleHover", "resetViews", "toggleSpikelines", "resetViewMapbox"
      // [this._activityChartService.imageButtonOptions, "toImage"],
      ['toImage'],
      ['zoom2d', 'pan2d', 'select2d', 'lasso2d'],
      ['zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d'],
      ['toggleSpikelines', 'hoverClosestCartesian', 'hoverCompareCartesian']
    ]
  };

  style: any = {
    position: 'relative',
    width: '100%',
    height: 'calc(100vh - 40px)',
  }

  imageButtonOptions: any = {
    name: 'image_settings',
    title: 'Edit image settings',
    icon: PlotlyJS.Icons.pencil,
    click: function(gd: any) { }
  };

  frames: any[] = [];

  constructor(project: Project, mode: string = 'project') {
    super(project);
    this.init(mode);
    this.update();
  }

  get data(): any[] {
    const graphData: any[] = [];
    const panels: Panel[] = this.panels.filter(panel => panel.data.length > 0);

    panels.forEach((panel, idx) => {
      panel.updateLayout(idx);
      panel.data.forEach(data => {
        this.layout['yaxis' + (panels.length - idx)] = panel.layout.yaxis;
        graphData.push(data);
      })
    });
    return graphData;
  }

  init(mode: string): void {
    console.log('Init activity chart');
    this.panels = mode === 'model' ? [new ModelAnalogLines(this)] : this.registerPanels.map(panel => panel[1](this));
  }

  update(): void {
    console.log('Update activity chart');
    this.panels.forEach(panel => panel.update());
  }

  updateColor(): void {
    console.log('Update color in activity chart');
    this.panels.forEach(panel => panel.updateColor());
  }

  // setPanelSizes(): void {
  //   var numPanels = this.panels.length;
  //
  //   this.panels.forEach(panel => {
  //     if (panel.constructor.name === 'AnalogLines' && panel.elementType === 'stimulator') {
  //       panel.size = [1, 1, 1, 1][numPanels - 1];
  //     }
  //     if (p == 'analog') {
  //       this.panel[p].size = [1, 1, 2, 2][numPanels - 1];
  //     }
  //     if (p == 'spike') {
  //       this.panel[p].size = [1, 4, 2, 2][numPanels - 1];
  //     }
  //     if (p == 'histogram') {
  //       this.panel[p].size = [1, 1, 1, 1][numPanels - 1];
  //     }
  //   })
  //   var sizes = this.panelSelected.map(p => this.panel[p].size);
  //   var totalSize = sizes.reduce((a, b) => a + b, 0);
  //   this.panelSelected.map((p, i) => this.panel[p].size = Math.round(sizes[i] / totalSize * 100));
  // }

}
