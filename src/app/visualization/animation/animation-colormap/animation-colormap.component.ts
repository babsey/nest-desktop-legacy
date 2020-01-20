import { Component, OnInit } from '@angular/core';

import { AnimationControllerService } from '../animation-controller/animation-controller.service';


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
    public _animationControllerService: AnimationControllerService,
  ) {
  }

  ngOnInit(): void {
  }

  onValueChange(value: number): void {
    this._animationControllerService.update.emit()
  }

}
