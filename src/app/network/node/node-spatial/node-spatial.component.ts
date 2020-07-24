import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { NetworkConfigService } from '../../network-config/network-config.service';
import { PositionService } from '../../services/position.service';

import { Node } from '../../../components/node';


@Component({
  selector: 'app-node-spatial',
  templateUrl: './node-spatial.component.html',
  styleUrls: ['./node-spatial.component.scss']
})
export class NodeSpatialComponent implements OnInit {
  @Input() node: Node;
  @Output() nodeChange: EventEmitter<any> = new EventEmitter();
  public graph: any = {
    data: [],
    layout: {},
  }
  public showPlot: boolean = false;
  public positionType: string = 'free';

  constructor(
    public _networkConfigService: NetworkConfigService,
    private _positionService: PositionService,
  ) { }

  ngOnInit() {
  }

  plot(): void {
    if (!this.node.spatial.hasOwnProperty('positions')) return
    const x: number[] = [];
    const y: number[] = [];
    this.node.spatial.positions.values.map(p => {
      x.push(p[0])
      y.push(p[1])
    })

    this.graph.data = [{
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
    const center: number[] = this.node.spatial.positions['center'] || [0, 0];
    const minX: number = center[0] - extent[0] / 2;
    const maxX: number = center[0] + extent[0] / 2;
    const minY: number = center[1] - extent[1] / 2;
    const maxY: number = center[1] + extent[1] / 2;

    this.graph.layout = {
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

  spatialEvent(event: any): void {
    this.node.spatial.positions.edgeWrap = event.option.selected;
    // this.nodeChange.emit()
  }

}
