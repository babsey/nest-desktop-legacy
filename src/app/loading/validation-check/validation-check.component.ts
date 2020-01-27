import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-validation-check',
  templateUrl: './validation-check.component.html',
  styleUrls: ['./validation-check.component.scss']
})
export class ValidationCheckComponent implements OnInit {
  @Input() status: any;

  constructor() { }

  ngOnInit() {
  }

  icon(): string {
    if (!this.status.ready) return 'circle-notch';
    return this.status.valid ? 'check' : 'exclamation'
  }

}
