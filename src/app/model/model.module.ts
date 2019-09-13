import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppFormsModule } from '../forms/forms.module';
import { AppRoutingModule } from '../modules/app-routing.module';

import { MaterialModule } from '../modules/material.module';
import { AppPipesModule } from '../pipes/pipes.module';

import { ModelComponent } from './model.component';
import { ModelDocumentationComponent } from './model-documentation/model-documentation.component';
import { ModelListComponent } from './model-list/model-list.component';
import { ModelParamsListComponent } from './model-params-list/model-params-list.component';
import { ModelParamsSelectionListComponent } from './model-params-selection-list/model-params-selection-list.component';
import { ModelParamsSliderComponent } from './model-params-slider/model-params-slider.component';


@NgModule({
  declarations: [
    ModelComponent,
    ModelDocumentationComponent,
    ModelListComponent,
    ModelParamsListComponent,
    ModelParamsSelectionListComponent,
    ModelParamsSliderComponent,
  ],
  exports: [
    ModelComponent,
    ModelDocumentationComponent,
    ModelListComponent,
    ModelParamsListComponent,
    ModelParamsSelectionListComponent,
    ModelParamsSliderComponent,
  ],
  imports: [
    AppPipesModule,
    AppRoutingModule,
    AppFormsModule,
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  providers: [
  ]
})
export class ModelModule { }
