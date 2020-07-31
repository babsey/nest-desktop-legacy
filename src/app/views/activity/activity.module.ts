import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AngularSplitModule } from 'angular-split';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';
PlotlyModule.plotlyjs = PlotlyJS;

import { AppPipesModule } from '../../pipes/pipes.module';

import { MaterialModule } from '../material.module';
import { AppFormsModule } from '../forms/forms.module';

import { ActivityGraphComponent } from './activity-graph/activity-graph.component';
import { ActivityGraphConfigComponent } from './activity-graph-config/activity-graph-config.component';

import { ActivityControllerComponent } from './activity-controller/activity-controller.component';
import { ActivityAnimationControllerComponent } from './activity-controller/activity-animation-controller/activity-animation-controller.component';
import { ActivityChartControllerComponent } from './activity-controller/activity-chart-controller/activity-chart-controller.component';

import { ActivityChartComponent } from './activity-chart/activity-chart.component';
import { ActivityChartSplitControllerComponent } from './activity-chart/activity-chart-split-controller/activity-chart-split-controller.component';

import { AnimationColormapComponent } from './activity-animation/animation-colormap/animation-colormap.component';
import { ActivityAnimationComponent } from './activity-animation/activity-animation.component';
import { ThreeScatterComponent } from './activity-animation/three-scatter/three-scatter.component';

import { SpikeStatsComponent } from './activity-stats/spike-stats/spike-stats.component';
import { ActivityStatsComponent } from './activity-stats/activity-stats.component';
import { AnalogStatsComponent } from './activity-stats/analog-stats/analog-stats.component';

@NgModule({
  declarations: [
    ActivityAnimationComponent,
    ActivityChartComponent,
    ActivityChartControllerComponent,
    ActivityChartSplitControllerComponent,
    ActivityControllerComponent,
    ActivityGraphComponent,
    ActivityGraphConfigComponent,
    ActivityStatsComponent,
    AnalogStatsComponent,
    AnimationColormapComponent,
    ActivityAnimationControllerComponent,
    SpikeStatsComponent,
    ThreeScatterComponent,
  ],
  exports: [
    ActivityAnimationComponent,
    ActivityChartComponent,
    ActivityChartControllerComponent,
    ActivityChartSplitControllerComponent,
    ActivityControllerComponent,
    ActivityGraphComponent,
    ActivityGraphConfigComponent,
    ActivityStatsComponent,
    AnalogStatsComponent,
    AnimationColormapComponent,
    ActivityAnimationControllerComponent,
    SpikeStatsComponent,
    ThreeScatterComponent,
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
export class ActivityModule { }
