import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';
PlotlyModule.plotlyjs = PlotlyJS;

import { AppFormsModule } from '../forms/forms.module';
import { AppPipesModule } from '../pipes/pipes.module';
import { MaterialModule } from '../modules/material.module';

import { AnimationControllerComponent } from './visualization-controller/animation-controller/animation-controller.component';
import { ChartControllerComponent } from './visualization-controller/chart-controller/chart-controller.component';
import { RecordsVisualizationComponent } from './records-visualization/records-visualization.component';
import { ThreeScatterComponent } from './three-scatter/three-scatter.component';
import { VisualizationComponent } from './visualization.component';
import { VisualizationConfigComponent } from './visualization-config/visualization-config.component';
import { VisualizationControllerComponent } from './visualization-controller/visualization-controller.component';


@NgModule({
  declarations: [
    AnimationControllerComponent,
    ChartControllerComponent,
    RecordsVisualizationComponent,
    ThreeScatterComponent,
    VisualizationComponent,
    VisualizationConfigComponent,
    VisualizationControllerComponent,
  ],
  exports: [
    AnimationControllerComponent,
    ChartControllerComponent,
    RecordsVisualizationComponent,
    ThreeScatterComponent,
    VisualizationComponent,
    VisualizationConfigComponent,
    VisualizationControllerComponent,
  ],
  imports: [
    AppFormsModule,
    AppPipesModule,
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    MaterialModule,
    PlotlyModule,
  ]
})
export class VisualizationModule { }
