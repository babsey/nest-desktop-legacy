import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MccColorPickerModule } from 'material-community-components/color-picker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import * as PlotlyJS from 'plotly.js-dist';
import { PlotlyModule } from 'angular-plotly.js';
PlotlyModule.plotlyjs = PlotlyJS;

import { AppDirectivesModule } from '../../directives/directives.module';

import { AppFormsModule } from '../forms/forms.module';
import { ConnectionModule } from '../connection/connection.module';
import { MaterialModule } from '../material.module';
import { ModelModule } from '../model/model.module';
import { NodeModule } from '../node/node.module';

import { NetworkControllerComponent } from './network-controller/network-controller.component';
import { NetworkGraphBgComponent } from './network-graph/network-graph-bg/network-graph-bg.component';
import { NetworkGraphComponent } from './network-graph/network-graph.component';
import { NetworkListComponent } from './network-list/network-list.component';
import { NetworkNavbarComponent } from './network-navbar/network-navbar.component';
import { NetworkSelectionComponent } from './network-selection/network-selection.component';


@NgModule({
  declarations: [
    NetworkControllerComponent,
    NetworkGraphBgComponent,
    NetworkGraphComponent,
    NetworkListComponent,
    NetworkNavbarComponent,
    NetworkSelectionComponent,
  ],
  exports: [
    NetworkControllerComponent,
    NetworkGraphBgComponent,
    NetworkGraphComponent,
    NetworkListComponent,
    NetworkNavbarComponent,
    NetworkSelectionComponent,
  ],
  imports: [
    AppDirectivesModule,
    AppFormsModule,
    BrowserAnimationsModule,
    CommonModule,
    ConnectionModule,
    FontAwesomeModule,
    FormsModule,
    NodeModule,
    MaterialModule,
    MccColorPickerModule.forRoot({
      used_colors: []
    }),
    ModelModule,
    PlotlyModule,
  ],
  providers: [],
})
export class NetworkModule { }
