import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  public nodes: any;
  public links: any;

  constructor() {
    this.nodes = [
      ['#1f77b4', 'blue'],
      ['#ff7f0e', 'orange'],
      ['#2ca02c', 'green'],
      ['#d62728', 'red'],
      ['#9467bd', 'purple'],
      ['#8c564b', 'brown'],
      ['#e377c2', 'pink'],
      ['#7f7f7f', 'gray'],
      ['#bcbd22', 'yellow'],
      ['#17becf', 'cyan'],
    ];
    this.links = {
      inh: '#b34846',
      exc: '#467ab3',
    }
   }

}
