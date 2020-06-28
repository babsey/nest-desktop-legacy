import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppFormsModule } from '../forms/forms.module';
import { AppPipesModule } from '../pipes/pipes.module';
import { AppRoutingModule } from '../modules/app-routing.module';
import { MaterialModule } from '../modules/material.module';


import { ModelComponent } from './model.component';
import { ModelConfigComponent } from './model-config/model-config.component';
import { ModelConfigDialogComponent } from './model-config-dialog/model-config-dialog.component';
import { ModelDocumentationComponent } from './model-documentation/model-documentation.component';
import { ModelListComponent } from './model-list/model-list.component';
import { ModelParamsListComponent } from './model-params-list/model-params-list.component';
import { ModelParamsSelectionListComponent } from './model-params-selection-list/model-params-selection-list.component';
import { ModelParamsSliderComponent } from './model-params-slider/model-params-slider.component';
import { ModelParamComponent } from './model-param/model-param.component';
import { ModelSidenavTabsComponent } from './model-sidenav-tabs/model-sidenav-tabs.component';
import { ModelToolbarComponent } from './model-toolbar/model-toolbar.component';


@NgModule({
  declarations: [
    ModelComponent,
    ModelConfigComponent,
    ModelConfigDialogComponent,
    ModelDocumentationComponent,
    ModelListComponent,
    ModelParamComponent,
    ModelParamsListComponent,
    ModelParamsSelectionListComponent,
    ModelParamsSliderComponent,
    ModelSidenavTabsComponent,
    ModelToolbarComponent,
  ],
  exports: [
    ModelComponent,
    ModelConfigComponent,
    ModelConfigDialogComponent,
    ModelDocumentationComponent,
    ModelListComponent,
    ModelParamComponent,
    ModelParamsListComponent,
    ModelParamsSelectionListComponent,
    ModelParamsSliderComponent,
    ModelSidenavTabsComponent,
    ModelToolbarComponent,
  ],
  imports: [
    AppPipesModule,
    AppRoutingModule,
    AppFormsModule,
    BrowserAnimationsModule,
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  providers: [
  ],
  entryComponents: [
    ModelConfigDialogComponent,
  ],
})
export class ModelModule { }
