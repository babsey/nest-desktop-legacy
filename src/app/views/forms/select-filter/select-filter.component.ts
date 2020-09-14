import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


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
  private _filteredOptions: string[] = [];

  constructor() {
  }

  ngOnInit() {
    this._filteredOptions = this.options;
  }

  get filteredOptions(): string[] {
    return this._filteredOptions;
  }

  search(query: string): void {
    const result: string[] = [];
    for (const option of this.options) {
      if (option.label.toLowerCase().indexOf(query.toLowerCase()) > -1) {
        result.push(option);
      }
    }
    this._filteredOptions = result;
  }

  onSelectionChange(): void {
    this.selectedChange.emit(this.selected);
  }
}
