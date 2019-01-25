import { Component, OnInit, Input } from '@angular/core';

import { ColorService } from '../../services/color/color.service';
import { DataService } from '../../services/data/data.service';
import { SketchService } from '../../sketch/sketch.service';


@Component({
  selector: 'app-links-view',
  templateUrl: './links-view.component.html',
  styleUrls: ['./links-view.component.css']
})
export class LinksViewComponent implements OnInit {
  @Input() links: any;
  @Input() selectiveView: any = false;

  constructor(
    private _colorService: ColorService,
    public _dataService: DataService,
    public _sketchService: SketchService,
  ) { }

  ngOnInit() {
  }

  color(idx) {
    return this._colorService.nodes[idx % this._colorService.nodes.length];
  }

  weight(link) {
    var color = this._colorService.links;
    if (link.hasOwnProperty('syn_spec')) {
      if (link['syn_spec'].hasOwnProperty('weight')) {
        return link['syn_spec']['weight'] >= 0 ? color.exc : color.inh;
      }
    }
    return color.exc;
  }
}
