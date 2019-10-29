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

import { AnimationAnalogComponent } from './animation/animation-analog/animation-analog.component';
import { AnimationControllerComponent } from './animation/animation-controller/animation-controller.component';
import { AnimationSpikeComponent } from './animation/animation-spike/animation-spike.component';
import { AnimationColormapComponent } from './animation/animation-colormap/animation-colormap.component';
import { PlotControllerComponent } from './plot/plot-controller/plot-controller.component';
import { PlotRecordsComponent } from './plot/plot-records/plot-records.component';
import { ThreeScatterComponent } from './animation/three-scatter/three-scatter.component';
import { VisualizationComponent } from './visualization.component';
import { VisualizationConfigComponent } from './visualization-config/visualization-config.component';


@NgModule({
  declarations: [
    AnimationAnalogComponent,
    AnimationColormapComponent,
    AnimationControllerComponent,
    AnimationSpikeComponent,
    PlotControllerComponent,
    PlotRecordsComponent,
    ThreeScatterComponent,
    VisualizationComponent,
    VisualizationConfigComponent,
  ],
  exports: [
    AnimationAnalogComponent,
    AnimationColormapComponent,
    AnimationControllerComponent,
    AnimationSpikeComponent,
    PlotControllerComponent,
    PlotRecordsComponent,
    ThreeScatterComponent,
    VisualizationComponent,
    VisualizationConfigComponent,
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
