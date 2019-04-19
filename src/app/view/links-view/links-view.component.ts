import { Component, OnInit, Input } from '@angular/core';

import { ColorService } from '../../services/color/color.service';
import { ControllerService } from '../../controller/controller.service';
import { DataService } from '../../services/data/data.service';
import { FormatService } from '../../services/format/format.service';
import { SketchService } from '../../sketch/sketch.service';
import { NetworkSimulationService } from '../../network/network-simulation/network-simulation.service';


@Component({
  selector: 'app-links-view',
  templateUrl: './links-view.component.html',
  styleUrls: ['./links-view.component.css']
})
export class LinksViewComponent implements OnInit {
  @Input() data: any = {};
  @Input() selective: boolean = false;
  @Input() editing: boolean = false;

  constructor(
    private _networkSimulationService: NetworkSimulationService,
    public _colorService: ColorService,
    public _controllerService: ControllerService,
    public _dataService: DataService,
    public _formatService: FormatService,
    public _sketchService: SketchService,
  ) { }

  ngOnInit() {
  }

  colorNode(idx) {
    return this._colorService.node(this.data.collections[idx])
  }

  dblclick(link) {
    if (link.display.includes('link')) {
      link.display = [];
    } else {
      link.display = ['link', 'connRule', 'synModel', 'weight', 'delay'];
    }
  }

  linkDisplay(link) {
    // var display = 'display' in link ? link.display.includes('link') : true;
    return (this._sketchService.isSelectedLink_or_all(link) || !this.selective) ? '' : 'none'
  }

  paramDisplay(link, param) {
    var display = 'display' in link ? link.display.includes(param) : true;
    return display ? '' : 'none'
  }

  isBothLayer(link) {
    return this._dataService.isBothLayer(link, this.data.collections);
  }

}
