import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';



@Component({
  selector: 'app-input-inline',
  templateUrl: './input-inline.component.html',
  styleUrls: ['./input-inline.component.scss']
})
export class InputInlineComponent implements OnInit {
  @Input() options: any;
  @Input() value: any;
  @Input() view: string;
  @Output() valueChange: EventEmitter<any> = new EventEmitter();

  constructor(
  ) { }

  ngOnInit() {
  }

}
