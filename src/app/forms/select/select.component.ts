import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';

import { ConfigService } from '../../config/config.service';
import { DataService } from '../../services/data/data.service';
import { SimulationService } from '../../simulation/simulation.service';


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
  @Input() color: any;
  @Output() selectChange = new EventEmitter();
  public elements: any;
  public filteredElements: any;

  public faSearch = faSearch;

  constructor(
    private _configService: ConfigService,
    private _dataService: DataService,
    private _simulationService: SimulationService,
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

  onSelectionChange() {
    this.selectChange.emit(this.selected);
    if (this._dataService.options.edit) return
    this._simulationService.run()
  }
}
