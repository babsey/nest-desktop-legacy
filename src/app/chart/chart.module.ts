import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppFormsModule } from '../forms/forms.module';
import { AppNodeModule } from '../node/node.module';
import { AppPipesModule } from '../pipes/pipes.module';
import { MaterialModule } from '../modules/material.module';

import { ChartComponent } from './chart.component';
import { AreaChartComponent } from './area-chart/area-chart.component';
// import { BarChartComponent } from './bar-chart/bar-chart.component';
import { CoordinateAxesComponent } from './coordinate-axes/coordinate-axes.component';
import { IsiChartComponent } from './isi-chart/isi-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { PsthChartComponent } from './psth-chart/psth-chart.component';
import { ScatterChartComponent } from './scatter-chart/scatter-chart.component';
import { SpikeChartComponent } from './spike-chart/spike-chart.component';
import { SVGAreaChartComponent } from './svg-area-chart/svg-area-chart.component';
import { SVGBarChartComponent } from './svg-bar-chart/svg-bar-chart.component';
import { SVGLineChartComponent } from './svg-line-chart/svg-line-chart.component';
import { SVGScatterChartComponent } from './svg-scatter-chart/svg-scatter-chart.component';
import { TraceChartComponent } from './trace-chart/trace-chart.component';

import { ChartService } from './chart.service';

@NgModule({
  declarations: [
    ChartComponent,
    AreaChartComponent,
    // BarChartComponent,
    CoordinateAxesComponent,
    IsiChartComponent,
    LineChartComponent,
    PsthChartComponent,
    ScatterChartComponent,
    SpikeChartComponent,
    SVGAreaChartComponent,
    SVGBarChartComponent,
    SVGLineChartComponent,
    SVGScatterChartComponent,
    TraceChartComponent,
  ],
  exports: [
    ChartComponent,
    AreaChartComponent,
    // BarChartComponent,
    LineChartComponent,
    PsthChartComponent,
    ScatterChartComponent,
    SpikeChartComponent,
    SVGAreaChartComponent,
    SVGBarChartComponent,
    SVGLineChartComponent,
    SVGScatterChartComponent,
    TraceChartComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FontAwesomeModule,
    AppFormsModule,
    AppPipesModule,
    AppNodeModule,
  ],
  providers: [
    ChartService,
  ]
})
export class ChartModule { }
