import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-activity-animation-colormap',
  templateUrl: './activity-animation-colormap.component.html',
  styleUrls: ['./activity-animation-colormap.component.scss']
})
export class ActivityAnimationColormapComponent implements OnInit {
  @Input() colorMap: any;
  @Output() colorMapChange: EventEmitter<any> = new EventEmitter();
  private _scales: string[];


  constructor() {
    this._scales = [
      'BrBG',
      'PRGn',
      'PiYG',
      'PuOr',
      'RdBu',
      'RdGy',
      'RdYlBu',
      'RdYlGn',
      'Spectral',
      'Blues',
      'Greens',
      'Greys',
      'Oranges',
      'Purples',
      'Reds',
      'Turbo',
      'Viridis',
      'Inferno',
      'Magma',
      'Plasma',
      'Cividis',
      'Warm',
      'Cool',
      'CubehelixDefault',
      'BuGn',
      'BuPu',
      'GnBu',
      'OrRd',
      'PuBuGn',
      'PuBu',
      'PuRd',
      'RdPu',
      'YlGnBu',
      'YlGn',
      'YlOrBr',
      'YlOrRd',
      'Rainbow',
      'Sinebow',
    ];
  }

  ngOnInit() {
  }

  get scales(): string[] {
    return this._scales;
  }

  onChange(event: any): void {
    this.colorMapChange.emit(this.colorMap);
  }

}
