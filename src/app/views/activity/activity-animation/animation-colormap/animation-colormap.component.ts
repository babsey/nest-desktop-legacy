import { Component, OnInit } from '@angular/core';

import { ActivityGraphService } from '../../../../services/activity/activity-graph.service';


@Component({
  selector: 'app-animation-colormap',
  templateUrl: './animation-colormap.component.html',
  styleUrls: ['./animation-colormap.component.scss']
})
export class AnimationColormapComponent implements OnInit {
  public scales: string[] = [
    'spectral',
    // 'turbo',
    'viridis',
    'inferno',
    'magma',
    'plasma',
    // 'cividis',
    'warm',
    'cool',
    'cubehelix'
  ];

  constructor(
    private _activityGraphService: ActivityGraphService,
  ) { }

  ngOnInit() {
  }

  get colorMap(): any {
    return this._activityGraphService.graph.config.colorMap;
  }

  onChange(event: any): void {
    this._activityGraphService.update.emit();
  }

}
