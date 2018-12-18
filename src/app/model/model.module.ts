import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppFormsModule } from '../forms/forms.module';

import { MaterialModule } from '../modules/material.module';
import { AppPipesModule } from '../pipes/pipes.module';

import { ModelComponent } from './model.component';
import { ModelConfigComponent } from './model-config/model-config.component';
import { ModelDescriptionComponent } from './model-description/model-description.component';
import { ModelDetailsComponent } from './model-details/model-details.component';

import { ModelService } from './model.service';

@NgModule({
  imports: [
    AppPipesModule,
    AppFormsModule,
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ModelComponent,
    ModelConfigComponent,
    ModelDescriptionComponent,
    ModelDetailsComponent,
  ],
  providers: [
    ModelService,
  ],
  exports: [
    ModelComponent,
    ModelConfigComponent,
    ModelDescriptionComponent,
    ModelDetailsComponent,
  ]
})
export class ModelModule { }
