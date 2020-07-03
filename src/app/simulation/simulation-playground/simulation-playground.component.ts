import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { ColorService } from '../../network/services/color.service';
import { NetworkService } from '../../network/services/network.service';
import { SimulationRunService } from '../services/simulation-run.service';
import { SimulationService } from '../services/simulation.service';
import { VisualizationService } from '../../visualization/visualization.service';

import { Data } from '../../classes/data';
import { AppNode } from '../../classes/appNode';
import { Record } from '../../classes/record';

import { enterAnimation } from '../../animations/enter-animation';


@Component({
  selector: 'app-simulation-playground',
  templateUrl: './simulation-playground.component.html',
  styleUrls: ['./simulation-playground.component.scss'],
  animations: [enterAnimation],
})
export class SimulationPlaygroundComponent implements OnInit, OnDestroy {
  @Input() data: Data;
  @Input() records: Record[] = [];
  private subscription: any;
  public layout: any = {};
  public kernel: any = {};

  constructor(
    private _colorService: ColorService,
    private _networkService: NetworkService,
    private _simulationRunService: SimulationRunService,
    private _simulationService: SimulationService,
    private _visualizationService: VisualizationService,
  ) {
  }

  ngOnInit(): void {
    // console.log('Init simulation playgound')
    this.subscription = this._simulationRunService.simulated.subscribe(resData => this.update(resData))
  }

  ngOnDestroy(): void {
    // console.log('Destroy simulation playgound')
    this.subscription.unsubscribe()
  }

  update(response: any): void {
    // console.log(response)
    // Update kernel time

    this._visualizationService.time = response.kernel['time'];
    if (this.data) {
      this.data.app.kernel.time = response.kernel['time'];
      this.kernel['time'] = response.kernel['time'];
      this.layout.title = this.data.name;


    }

    // // Update global ids, record_from, positions
    // resData.nodes.map((simNode, idx) => {
    //   const node: AppNode = this.data.app.nodes[idx];
    //   if (node == undefined) return
    //   node['global_ids'] = simNode.global_ids;
    //   const params: any = this.data.simulation.models[simNode.model].params;
    //   if (params.hasOwnProperty('record_from')) {
    //     node['record_from'] = params.record_from;
    //   } else {
    //     delete node['record_from'];
    //   }
    // })

    // Update records
    const records: any[] = this.records;
    response['records'].map((rec, idx) => {
      if (idx >= records.length) {
        records.push({
          config: {}
        });
      }
      let record: Record = records[idx];
      record['idx'] = idx;
      record['recorder'] = rec['recorder'];
      record['events'] = rec['events'][0];
      var senders = [...new Set(record['events']['senders'])];
      senders.sort((a: number, b: number) => a - b);

      record['nodes'] = {
        'element_types': this.fetchElementTypes(record.recorder.idx),
        'global_ids': rec['global_ids'],
        'positions': rec['positions'] || [],
        'senders': senders,
      };
      var Vth = this.listParams(record.recorder.idx, 'V_th');
      if (Vth.length > 0) {
        record.nodes['V_th'] = Vth;
      }

      const recorder = this.data.simulation.collections[record.recorder.idx];
      if (recorder) {
        record['layout'] = {
          'label': recorder.label,
          'color': this._colorService.node(record.recorder.idx),
        }
      }

    })
    this._visualizationService.checkPositions(records);

    if (['animation', 'chart'].includes(this._simulationService.sidenavMode)) {
      this._simulationService.sidenavMode = this._visualizationService.mode;
    }
    this._visualizationService.update.emit()
  }

  fetchElementTypes(idx: number): string[] {
    return this.data.simulation.connectomes.filter(connectome => connectome.source == idx
    ).map(connectome => this.data.simulation.collections[connectome.target].element_type);
  }

  listParams(idx: number, key: string = ''): any[] {
    var collections = this.data.simulation.connectomes.filter(
      connectome => connectome.source == idx).map(
        connectome => this.data.simulation.collections[connectome.target]);
    if (key) {
      return collections.filter(
        (collection, idx) => this.data.app.nodes[idx].display.includes(key)).map(
          collection => collection.params[key]);
    }
    return collections.map(collection => collection.params);
  }

}
