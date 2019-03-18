import { Component, OnInit, Input, OnChanges } from '@angular/core';


@Component({
  selector: 'app-model-config',
  templateUrl: './model-config.component.html',
  styleUrls: ['./model-config.component.css']
})
export class ModelConfigComponent implements OnInit, OnChanges {
  @Input() model: any = {};

  constructor(
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
  }

  save() {
  }

}
