import { Component, OnInit, Input, OnChanges } from '@angular/core';


@Component({
  selector: 'app-model-params-slider',
  templateUrl: './model-params-slider.component.html',
  styleUrls: ['./model-params-slider.component.scss']
})
export class ModelParamsSliderComponent implements OnInit, OnChanges {
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
