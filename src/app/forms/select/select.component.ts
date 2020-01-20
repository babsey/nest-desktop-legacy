import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent implements OnInit {
  @Input() disabled: boolean = false;
  @Input() options: any[] = [];
  @Input() placeholder: string = '';
  @Input() selected: string;
  @Output() selectedChange: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  onSelectionChange(): void {
    this.selectedChange.emit(this.selected);
  }
}
