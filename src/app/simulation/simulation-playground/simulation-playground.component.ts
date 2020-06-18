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
    // Update kernel time
    // console.log(response)
    this.data.app.kernel.time = response.kernel['time'];

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
      record['events'] = rec['events'];
      if (rec.hasOwnProperty('recorder')) {
        record['recorder'] = rec['recorder']
      } else {
        const recorderIdx = rec['recorderIdx'];
        const recorder = this.data.simulation.collections[recorderIdx];
        const model = this.data.simulation.models[recorder.model].existing;
        record['recorder'] = {
          'idx': recorderIdx,
          'model': model,
        }
      }
      var color = this._colorService.node(this.data.app.nodes[record.recorder.idx]);
      record.recorder['color'] = color;
      record['global_ids'] = rec['global_ids'];
      record['senders'] = [...new Set(rec['events']['senders'])];
      record['senders'].sort((a: number, b: number) => a - b)
      record['positions'] = rec['positions'] || [];
    })
    this._visualizationService.checkPositions(records);
    // this.records = records;

    this._visualizationService.time = this.data.app.kernel.time;
    if (['animation', 'chart'].includes(this._simulationService.sidenavMode)) {
      this._simulationService.sidenavMode = this._visualizationService.mode;
    }
    this._visualizationService.update.emit()
  }

}
