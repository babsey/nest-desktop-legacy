import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { NetworkService } from '../../network/services/network.service';
import { SimulationService } from '../services/simulation.service';
import { SimulationEventService } from '../services/simulation-event.service';



@Component({
  selector: 'app-simulation-raw-data',
  templateUrl: './simulation-raw-data.component.html',
  styleUrls: ['./simulation-raw-data.component.scss']
})
export class SimulationRawDataComponent implements OnInit, OnDestroy {
  public options: any = {
    cursorBlinkRate: 700,
    foldGutter: true,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    lineNumbers: true,
    lineWrapping: true,
    readOnly: true,
    mode: { name: 'javascript', json: true }
  };
  public content: any;
  private subscription: any;

  constructor(
    private _networkService: NetworkService,
    private _simulationService: SimulationService,
    private _simulationEventService: SimulationEventService,
  ) { }

  ngOnInit(): void {
    this.subscription = this._networkService.update.subscribe(() => this.update());
    this.update();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  update(): void {
    setTimeout(() => {
      this.content = JSON.stringify({
        data: this._simulationService.data,
        records: this._simulationEventService.records,
      }, null, "\t");
    }, 100)
  }

}
