import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AngularSplitModule } from 'angular-split';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import * as PlotlyJS from 'plotly.js-cartesian-dist';
import { PlotlyModule } from 'angular-plotly.js';
PlotlyModule.plotlyjs = PlotlyJS;

import { AppPipesModule } from '../../pipes/pipes.module';

import { MaterialModule } from '../material.module';
import { AppFormsModule } from '../forms/forms.module';
import { NodeModule } from '../node/node.module';

import { ActivityGraphComponent } from './activity-graph/activity-graph.component';

import { ActivityChartComponent } from './activity-chart/activity-chart.component';
import { ActivityChartControllerComponent } from './activity-chart/activity-chart-controller/activity-chart-controller.component';

import { ActivityAnimationComponent } from './activity-animation/activity-animation.component';
import { ActivityAnimationSceneComponent } from './activity-animation/activity-animation-scene/activity-animation-scene.component';
import { ActivityAnimationControllerComponent } from './activity-animation/activity-animation-controller/activity-animation-controller.component';
import { ActivityAnimationColormapComponent } from './activity-animation/activity-animation-colormap/activity-animation-colormap.component';

import { SpikeStatsComponent } from './activity-stats/spike-stats/spike-stats.component';
import { ActivityStatsComponent } from './activity-stats/activity-stats.component';
import { AnalogStatsComponent } from './activity-stats/analog-stats/analog-stats.component';


@NgModule({
  declarations: [
    ActivityAnimationColormapComponent,
    ActivityAnimationComponent,
    ActivityAnimationControllerComponent,
    ActivityAnimationSceneComponent,
    ActivityChartComponent,
    ActivityChartControllerComponent,
    ActivityGraphComponent,
    ActivityStatsComponent,
    AnalogStatsComponent,
    SpikeStatsComponent,
  ],
  exports: [
    ActivityAnimationColormapComponent,
    ActivityAnimationComponent,
    ActivityAnimationControllerComponent,
    ActivityAnimationSceneComponent,
    ActivityChartComponent,
    ActivityChartControllerComponent,
    ActivityGraphComponent,
    ActivityStatsComponent,
    AnalogStatsComponent,
    SpikeStatsComponent,
  ],
  imports: [
    AngularSplitModule.forRoot(),
    AppFormsModule,
    AppPipesModule,
    CodemirrorModule,
    CommonModule,
    DragDropModule,
    FontAwesomeModule,
    FormsModule,
    NodeModule,
    MaterialModule,
    PlotlyModule,
  ]
})
export class ActivityModule { }
