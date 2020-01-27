import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-response-check',
  templateUrl: './response-check.component.html',
  styleUrls: ['./response-check.component.scss']
})
export class ResponseCheckComponent implements OnInit {
  @Input() response: boolean;
  @Input() status: any;

  constructor() { }

  ngOnInit() {
  }

  icon(): string {
    if (!this.response) return 'circle-notch';
    if (!this.status.ready) return 'times';
    return this.status.valid ? 'check' : 'exclamation'
  }

}
