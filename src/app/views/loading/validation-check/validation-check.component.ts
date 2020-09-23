import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-validation-check',
  templateUrl: './validation-check.component.html',
  styleUrls: ['./validation-check.component.scss']
})
export class ValidationCheckComponent implements OnInit {
  @Input() isReady = false;
  @Input() isValid = false;

  constructor() { }

  ngOnInit() {
  }

}
