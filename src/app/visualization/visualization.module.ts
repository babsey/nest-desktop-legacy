import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AngularSplitModule } from 'angular-split';


import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';
PlotlyModule.plotlyjs = PlotlyJS;

import { AppFormsModule } from '../forms/forms.module';
import { AppPipesModule } from '../pipes/pipes.module';
import { MaterialModule } from '../modules/material.module';

import { AnimationAnalogComponent } from './animation/animation-analog/animation-analog.component';
import { AnimationControllerComponent } from './animation/animation-controller/animation-controller.component';
import { AnimationSpikeComponent } from './animation/animation-spike/animation-spike.component';
import { AnimationColormapComponent } from './animation/animation-colormap/animation-colormap.component';
import { ChartControllerComponent } from './chart/chart-controller/chart-controller.component';
import { ChartRecordsComponent } from './chart/chart-records/chart-records.component';
import { ChartSplitControllerComponent } from './chart/chart-split-controller/chart-split-controller.component';
import { ThreeScatterComponent } from './animation/three-scatter/three-scatter.component';
import { VisualizationComponent } from './visualization.component';
import { VisualizationConfigComponent } from './visualization-config/visualization-config.component';



@NgModule({
  declarations: [
    AnimationAnalogComponent,
    AnimationColormapComponent,
    AnimationControllerComponent,
    AnimationSpikeComponent,
    ChartControllerComponent,
    ChartRecordsComponent,
    ChartSplitControllerComponent,
    ThreeScatterComponent,
    VisualizationComponent,
    VisualizationConfigComponent,
  ],
  exports: [
    AnimationAnalogComponent,
    AnimationColormapComponent,
    AnimationControllerComponent,
    AnimationSpikeComponent,
    ChartControllerComponent,
    ChartRecordsComponent,
    ChartSplitControllerComponent,
    ThreeScatterComponent,
    VisualizationComponent,
    VisualizationConfigComponent,
  ],
  imports: [
    AngularSplitModule.forRoot(),
    AppFormsModule,
    AppPipesModule,
    CommonModule,
    DragDropModule,
    FontAwesomeModule,
    FormsModule,
    MaterialModule,
    PlotlyModule,
  ]
})
export class VisualizationModule { }
