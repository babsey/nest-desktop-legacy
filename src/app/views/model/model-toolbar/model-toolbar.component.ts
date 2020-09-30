import { Component, OnInit, ViewChild } from '@angular/core';

import { enterAnimation } from '../../../animations/enter-animation';

import { Model } from '../../../components/model/model';

import { ModelService } from '../../../services/model/model.service';


@Component({
  selector: 'app-model-toolbar',
  templateUrl: './model-toolbar.component.html',
  styleUrls: ['./model-toolbar.component.scss'],
  animations: [enterAnimation],
})
export class ModelToolbarComponent implements OnInit {

  constructor(
    private _modelService: ModelService,
  ) { }

  ngOnInit() {
  }

  get modelLabel(): string {
    return this._modelService.label();
  }

  get selectedModel(): string {
    return this._modelService.selectedModel;
  }

  hasModel(): boolean {
    return this._modelService.hasModel();
  }

  addModel(): void {
    this._modelService.addModel();
  }

  deleteModel(): void {
    this._modelService.deleteModel();
  }

  saveModel(): void {
    this._modelService.saveModel();
  }

}
