import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import * as PlotlyJS from 'plotly.js-dist';
import { PlotlyModule } from 'angular-plotly.js';
PlotlyModule.plotlyjs = PlotlyJS;

import { AppDirectivesModule } from '../../directives/directives.module';
import { AppPipesModule } from '../../pipes/pipes.module';

import { AppFormsModule } from '../forms/forms.module';
import { MaterialModule } from '../material.module';
import { RoutesModule } from '../routes.module';

import { ModelActivityFICurveComponent } from './model-activity-FI-curve/model-activity-FI-curve.component';
import { ModelActivityGraphComponent } from './model-activity-graph/model-activity-graph.component';
import { ModelActivitySpikeResponseComponent } from './model-activity-spike-response/model-activity-spike-response.component';
import { ModelComponent } from './model.component';
import { ModelConfigDialogComponent } from './model-config-dialog/model-config-dialog.component';
import { ModelDocumentationComponent } from './model-documentation/model-documentation.component';
import { ModelListComponent } from './model-list/model-list.component';
import { ModelParamComponent } from './model-param/model-param.component';
import { ModelParamsListComponent } from './model-params-list/model-params-list.component';
import { ModelParamsSelectionListComponent } from './model-params-selection-list/model-params-selection-list.component';
import { ModelParamsSliderComponent } from './model-params-slider/model-params-slider.component';
import { ModelSidenavTabsComponent } from './model-sidenav-tabs/model-sidenav-tabs.component';
import { ModelToolbarComponent } from './model-toolbar/model-toolbar.component';


@NgModule({
  declarations: [
    ModelActivityFICurveComponent,
    ModelActivityGraphComponent,
    ModelActivitySpikeResponseComponent,
    ModelComponent,
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
    ModelActivityFICurveComponent,
    ModelActivityGraphComponent,
    ModelActivitySpikeResponseComponent,
    ModelComponent,
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
    AppDirectivesModule,
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
