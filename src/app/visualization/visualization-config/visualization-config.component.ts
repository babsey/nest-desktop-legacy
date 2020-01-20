import { Component, OnInit } from '@angular/core';

import { VisualizationConfigService } from './visualization-config.service';


@Component({
  selector: 'app-visualization-config',
  templateUrl: './visualization-config.component.html',
  styleUrls: ['./visualization-config.component.scss']
})
export class VisualizationConfigComponent implements OnInit {

  constructor(
    public _visualizationConfigService: VisualizationConfigService,
  ) { }

  ngOnInit(): void {
  }

}
