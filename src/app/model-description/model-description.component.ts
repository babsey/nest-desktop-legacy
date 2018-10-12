import { Component, OnInit } from '@angular/core';

import { ModelService } from '../shared/services/model/model.service';

@Component({
  selector: 'app-model-description',
  templateUrl: './model-description.component.html',
  styleUrls: ['./model-description.component.css']
})
export class ModelDescriptionComponent implements OnInit {

  constructor(
    public _modelService: ModelService,
  ) { }

  ngOnInit() {
  }

}
