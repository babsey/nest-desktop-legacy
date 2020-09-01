import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-select-optgroup',
  templateUrl: './select-optgroup.component.html',
  styleUrls: ['./select-optgroup.component.scss'],
})
export class SelectOptgroupComponent implements OnInit {
  @Input() disabled: boolean = false;
  @Input() options: any[] = [];
  @Input() placeholder: string = '';
  @Input() selected: string = '';
  @Output() selectedChange: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  onSelectionChange(): void {
    this.selectedChange.emit(this.selected);
  }
}
