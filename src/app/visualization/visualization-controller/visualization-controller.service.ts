import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VisualizationControllerService {
  public selectedIdx: number = 0;

  constructor() { }
}
