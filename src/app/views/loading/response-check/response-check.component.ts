import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-response-check',
  templateUrl: './response-check.component.html',
  styleUrls: ['./response-check.component.scss']
})
export class ResponseCheckComponent implements OnInit {
  @Input() ready: boolean;
  @Input() valid: boolean;

  constructor() { }

  ngOnInit() {
  }

  icon(): string {
    if (!this.response) { return 'circle-notch'; }
    if (!this.ready) { return 'times'; }
    return this.valid ? 'check' : 'exclamation';
  }

  get response(): boolean {
    return this.ready !== undefined;
  }

}
