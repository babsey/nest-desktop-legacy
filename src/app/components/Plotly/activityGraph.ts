import * as PlotlyJS from 'plotly.js/dist/plotly.js';

import { Project } from '../project';
import { Panel } from './panel';

// Registered panels
import { NeuronAnalogLines } from './neuronAnalogLines';
import { InputAnalogLines } from './inputAnalogLines';
import { SpikeScatter } from './spikeScatter';
import { SpikeHistogram } from './spikeHistogram';



export class ActivityGraph {
  project: Project;                    // parent
  panels: any[] = [];
  registerPanels: any[][] = [
    ['Analog from stimulator', graph => new InputAnalogLines(graph)],
    ['Analog from neurons', graph => new NeuronAnalogLines(graph)],
    ['Spike scatter', graph => new SpikeScatter(graph)],
    ['Histogram of spikes', graph => new SpikeHistogram(graph)],
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
      // [this._chartRecordsService.imageButtonOptions, "toImage"],
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
    click: function(gd) { }
  };

  constructor(project: Project) {
    this.project = project;
    this.init();
  }

  get data(): any[] {
    const graphData = [];
    const panels: any[] = this.panels.filter(panel => panel.data.length > 0);

    panels.forEach((panel, idx) => {
      panel.updateLayout(idx);
      panel.data.forEach(data => {
        this.layout['yaxis' + (panels.length - idx)] = panel.layout.yaxis;
        graphData.push(data);
      })
    });
    return graphData;
  }


  init(): void {
    this.panels = this.registerPanels.map(panel => panel[1](this))
  }

  update(): void {
    this.panels.forEach(panel => panel.update())
  }

  updateColor(): void {
    this.panels.forEach(panel => panel.updateColor())
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
