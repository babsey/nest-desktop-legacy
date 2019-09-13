import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-select-filter',
  templateUrl: './select-filter.component.html',
  styleUrls: ['./select-filter.component.scss'],
})
export class SelectFilterComponent implements OnInit {
  @Input() disabled: boolean = false;
  @Input() filter: boolean = false;
  @Input() options: any[] = [];
  @Input() placeholder: string = '';
  @Input() selected: any = {};
  @Output() selectedChange: EventEmitter<any> = new EventEmitter();
  public filteredOptions: string[] = [];

  constructor() {
  }

  ngOnInit() {
    this.filteredOptions = this.options;
  }

  search(query: string) {
    let result: string[] = [];
    for (let option of this.options) {
      if (option.label.toLowerCase().indexOf(query.toLowerCase()) > -1) {
        result.push(option)
      }
    }
    this.filteredOptions = result;
  }

  onSelectionChange() {
    this.selectedChange.emit(this.selected);
  }
}
