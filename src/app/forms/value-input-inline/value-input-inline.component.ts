import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-value-input-inline',
  templateUrl: './value-input-inline.component.html',
  styleUrls: ['./value-input-inline.component.scss']
})
export class ValueInputInlineComponent implements OnInit {
  @Input() options: any;
  @Input() value: any;
  @Output() valueChange: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  onChange(value: any): void {
    let isString = typeof(value) == 'string' && value.length > 0;
    this.value =  isString ? Number(value) : this.options.value;
    this.valueChange.emit(this.value)
  }

}
