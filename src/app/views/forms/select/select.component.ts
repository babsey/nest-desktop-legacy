import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent implements OnInit {
  @Input() disabled = false;
  @Input() options: any[] = [];
  @Input() placeholder = '';
  @Input() selected: string;
  @Output() selectedChange: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  onSelectionChange(): void {
    this.selectedChange.emit(this.selected);
  }
}
