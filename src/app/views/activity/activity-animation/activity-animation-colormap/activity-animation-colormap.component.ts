import { Component, OnInit } from '@angular/core';

import { ActivityAnimationService } from '../../../../services/activity/activity-animation.service';


@Component({
  selector: 'app-activity-animation-colormap',
  templateUrl: './activity-animation-colormap.component.html',
  styleUrls: ['./activity-animation-colormap.component.scss']
})
export class ActivityAnimationColormapComponent implements OnInit {
  private _scales: string[] = [
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
    private _activityAnimationService: ActivityAnimationService,
  ) { }

  ngOnInit() {
  }

  get colorMap(): any {
    return this._activityAnimationService.graph.config.colorMap;
  }

  get scales(): string[] {
    return this._scales;
  }

  onChange(event: any): void {
    this._activityAnimationService.update.emit();
  }

}
