import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { SimulationScriptService } from './simulation-script.service';

import { Data } from '../../classes/data';


@Component({
  selector: 'app-simulation-script',
  templateUrl: './simulation-script.component.html',
  styleUrls: ['./simulation-script.component.scss']
})
export class SimulationScriptComponent implements OnInit, OnChanges {
  @Input() data: Data;
  public simulationScript: string;

  constructor(
    public _simulationScriptService: SimulationScriptService,
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (!this.data.hasOwnProperty('simulation')) return
    var simulation = this.data.simulation;

    var simulationScript = '';
    simulationScript += 'import nest\n';
    simulationScript += 'import numpy as np\n';

    simulationScript += '\n\nnp.random.seed(' + (simulation.seed || 0) + ')\n';

    simulationScript += '\n\n# Set kernel\n';
    simulationScript += this._simulationScriptService.kernel(simulation.kernel);

    simulationScript += '\n\n# Copy models\n';
    Object.keys(simulation.models).map(model => {
      simulationScript += this._simulationScriptService.copyModel(simulation.models[model].existing, model, simulation.models[model].params);
    })

    simulationScript += '\n\n# Create collections\n';
    simulation.collections.map(collection => {
      simulationScript += this._simulationScriptService.create(collection.model, collection.n);
    })

    simulationScript += '\n\n# Connect collections\n';
    simulation.connectomes.map(connectome => {
      var pre = simulation.collections[connectome.pre];
      var post = simulation.collections[connectome.post];
      simulationScript += this._simulationScriptService.connect(pre, post);
    })

    simulationScript += '\n';
    simulationScript += this._simulationScriptService.simulate(simulation.time);

    simulation.collections.filter(node => node.element_type == 'recorder').map(rec => {
      simulationScript += this._simulationScriptService.getStatus(rec, 'events')
    })

    this.simulationScript = simulationScript;
  }

  copyScript(): void {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.simulationScript;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

}
