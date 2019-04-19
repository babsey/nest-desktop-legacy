import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';


@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
})
export class SelectComponent implements OnInit {
  @Input() disabled: boolean = false;
  @Input() filter: boolean = false;
  @Input() options: any[] = [];
  @Input() placeholder: string = '';
  @Input() selected: any = {};
  @Output() selectChange = new EventEmitter();
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
    this.selectChange.emit(this.selected);
  }
}
