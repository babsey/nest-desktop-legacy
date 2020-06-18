import { Component, OnInit, Input } from '@angular/core';

import { SimulationService } from '../services/simulation.service';
import { SimulationScriptService } from './simulation-script.service';

import { Data } from '../../classes/data';


@Component({
  selector: 'app-simulation-script',
  templateUrl: './simulation-script.component.html',
  styleUrls: ['./simulation-script.component.scss']
})
export class SimulationScriptComponent implements OnInit {
  @Input() disabled: boolean = false;

  constructor(
    public _simulationScriptService: SimulationScriptService,
    public _simulationService: SimulationService,
  ) { }

  ngOnInit(): void {
  }

  copyScript(): void {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    // let value: string = this._simulationScriptService.importModules();
    const value = this._simulationService.script;
    selBox.value = value;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

}
