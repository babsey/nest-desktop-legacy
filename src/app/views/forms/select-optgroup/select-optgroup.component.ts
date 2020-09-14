import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-select-optgroup',
  templateUrl: './select-optgroup.component.html',
  styleUrls: ['./select-optgroup.component.scss'],
})
export class SelectOptgroupComponent implements OnInit {
  @Input() disabled = false;
  @Input() options: any[] = [];
  @Input() placeholder = '';
  @Input() selected = '';
  @Output() selectedChange: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  onSelectionChange(): void {
    this.selectedChange.emit(this.selected);
  }
}
