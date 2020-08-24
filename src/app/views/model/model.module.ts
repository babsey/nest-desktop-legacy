import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import * as PlotlyJS from 'plotly.js-cartesian-dist';
import { PlotlyModule } from 'angular-plotly.js';
PlotlyModule.plotlyjs = PlotlyJS;

import { AppPipesModule } from '../../pipes/pipes.module';

import { MaterialModule } from '../material.module';
import { RoutesModule } from '../routes.module';
import { AppFormsModule } from '../forms/forms.module';

import { ModelComponent } from './model.component';
import { ModelActivityGraphComponent } from './model-activity-graph/model-activity-graph.component';
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
    ModelActivityGraphComponent,
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
    ModelActivityGraphComponent,
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
    AppFormsModule,
    AppPipesModule,
    BrowserAnimationsModule,
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
    RoutesModule,
    PlotlyModule,
  ],
  providers: [
  ],
  entryComponents: [
    ModelConfigDialogComponent,
  ],
})
export class ModelModule { }
