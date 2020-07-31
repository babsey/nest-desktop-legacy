import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { enterAnimation } from '../../animations/enter-animation';

import { ModelService } from '../../services/model/model.service';


@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss'],
  animations: [ enterAnimation ],
})
export class ModelComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    public _modelService: ModelService,
  ) { }

  ngOnInit() {
    let paramMap = this.route.snapshot.paramMap;
    this._modelService.selectedModel = paramMap.get('model');
  }

  ngOnDestroy() {
    // this._modelService.selectedModel = '';
  }

}
