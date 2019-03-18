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
import { ModelConfigComponent } from './model-config/model-config.component';
import { ModelDocumentationComponent } from './model-documentation/model-documentation.component';
import { ModelDetailsComponent } from './model-details/model-details.component';
import { ModelListComponent } from './model-list/model-list.component';


@NgModule({
  declarations: [
    ModelComponent,
    ModelConfigComponent,
    ModelDocumentationComponent,
    ModelDetailsComponent,
    ModelListComponent,
  ],
  exports: [
    ModelComponent,
    ModelConfigComponent,
    ModelDocumentationComponent,
    ModelDetailsComponent,
    ModelListComponent,
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
