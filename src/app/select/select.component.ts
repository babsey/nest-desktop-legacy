import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';

import { ConfigService } from '../shared/services/config/config.service';
import { SimulationService } from '../shared/services/simulation/simulation.service';
import { SketchService } from '../shared/services/sketch/sketch.service';


import {
  faSearch,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
})
export class SelectComponent implements OnInit {
  @Input() placeholder: any;
  @Input() element_type: any;
  @Input() selected: any = {};
  @Output() selectChange = new EventEmitter();
  public elements: any;
  public filteredElements: any;

  public faSearch = faSearch;

  constructor(
    private _configService: ConfigService,
    private _simulationService: SimulationService,
    private _sketchService: SketchService,
  ) {
  }

  ngOnInit() {
    this.elements = this._configService.list(this.element_type);
    this.filteredElements = this.elements;
  }

  search(query: string) {
    let result: string[] = [];
    for (let element of this.elements) {
      if (element.toLowerCase().indexOf(query.toLowerCase()) > -1) {
        result.push(element)
      }
    }
    this.filteredElements = result;
  }

  changed() {
    this.selectChange.emit(this.selected);
    var resetChart = this.element_type == 'recorder';
    if (this._sketchService.options.drawing) return
    this._simulationService.run(resetChart)
  }
}
