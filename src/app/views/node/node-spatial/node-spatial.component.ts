import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Node } from '../../../components/node/node';
import { NodeSpatial } from '../../../components/node/nodeSpatial';


@Component({
  selector: 'app-node-spatial',
  templateUrl: './node-spatial.component.html',
  styleUrls: ['./node-spatial.component.scss']
})
export class NodeSpatialComponent implements OnInit {
  @Input() node: Node;
  @Output() nodeChange: EventEmitter<any> = new EventEmitter();
  private _graph: any = {
    data: [],
    layout: {},
  }
  private _showPlot: boolean = false;
  private _positionType: string = 'free';

  constructor(
  ) { }

  ngOnInit() {
    this._positionType = this.node.spatial.positions.name;
  }

  get graph(): any {
    return this._graph;
  }

  get showPlot(): boolean {
    return this._showPlot;
  }

  set showPlot(value: boolean) {
    this._showPlot = value;
  }

  get positionType(): string {
    return this._positionType;
  }

  set positionType(value: string) {
    this._positionType = value;
  }

  plot(): void {
    const x: number[] = [];
    const y: number[] = [];
    this.node.spatial.positions.values.map(p => {
      x.push(p[0])
      y.push(p[1])
    })

    this._graph.data = [{
      mode: 'markers',
      type: 'scattergl',
      x: x,
      y: y,
      hoverinfo: 'x+y',
      showlegend: false,
      marker: {
        color: 'black',
        size: 5,
      }
    }]

    const extent: number[] = this.node.spatial.positions.extent || [1, 1];
    const center: number[] = this.node.spatial.positions.center || [0, 0];
    const minX: number = center[0] - extent[0] / 2;
    const maxX: number = center[0] + extent[0] / 2;
    const minY: number = center[1] - extent[1] / 2;
    const maxY: number = center[1] + extent[1] / 2;

    this._graph.layout = {
      xaxis: {
        range: [minX + minX / 100, maxX + maxX / 100],
        title: 'Row',
      },
      yaxis: {
        range: [minY + minY / 100, maxY + maxY / 100],
        title: 'Column',
      },
      title: 'Positions'
    };
  }

  update(): void {
    console.log(this.node)
    this.node.spatial.positions.generate();
    this.plot();
  }

  onPositionTypeChange(event: any): void {
    console.log(this.positionType, event)
    const config: any = (this.positionType === 'free') ? {'pos': []} : {'shape': [1,1]};
    this.node.spatial = new NodeSpatial(this.node, config);
    this.update();
  }

  OnPositionParamChange(event: any): void {
    this.node.spatial.positions.edgeWrap = event.option.selected;
    this.update();
  }

}
