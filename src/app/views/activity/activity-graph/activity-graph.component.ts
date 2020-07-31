import { Component, OnInit, Input } from '@angular/core';

import { Project } from '../../../components/project/project';

import { SimulationRunService } from '../../../services/simulation/simulation-run.service';


@Component({
  selector: 'app-activity-graph',
  templateUrl: './activity-graph.component.html',
  styleUrls: ['./activity-graph.component.scss']
})
export class ActivityGraphComponent implements OnInit {
  @Input() project: Project;
  public mode: string = 'chart';

  constructor(
    public _simulationRunService: SimulationRunService
  ) {
  }

  ngOnInit() {
  }

}
