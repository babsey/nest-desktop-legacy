import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MaterialModule } from '../modules/material.module';
import { AppPipesModule } from '../pipes/pipes.module';

import { ModelComponent } from './model.component';
import { ModelDescriptionComponent } from './model-description/model-description.component';
import { ModelDetailsComponent } from './model-details/model-details.component';
import { ModelEditComponent } from './model-edit/model-edit.component';

import { ModelService } from './model.service';

@NgModule({
  imports: [
    AppPipesModule,
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ModelComponent,
    ModelDescriptionComponent,
    ModelDetailsComponent,
    ModelEditComponent,
  ],
  providers: [
    ModelService,
  ],
  exports: [
    ModelComponent,
    ModelDescriptionComponent,
    ModelDetailsComponent,
    ModelEditComponent,
  ]
})
export class ModelModule { }
