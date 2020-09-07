import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MccColorPickerModule } from 'material-community-components';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import * as PlotlyJS from 'plotly.js-cartesian-dist';
import { PlotlyModule } from 'angular-plotly.js';
PlotlyModule.plotlyjs = PlotlyJS;

import { AppDirectivesModule } from '../../directives/directives.module';

import { AppFormsModule } from '../forms/forms.module';
import { ConnectionModule } from '../connection/connection.module';
import { MaterialModule } from '../material.module';
import { ModelModule } from '../model/model.module';
import { NodeModule } from '../node/node.module';

import { BackgroundSketchComponent } from './network-sketch/background-sketch/background-sketch.component';
import { NetworkComponent } from './network.component';
import { NetworkControllerComponent } from './network-controller/network-controller.component';
import { NetworkListComponent } from './network-list/network-list.component';
import { NetworkNavbarComponent } from './network-navbar/network-navbar.component';
import { NetworkSelectionComponent } from './network-selection/network-selection.component';
import { NetworkSketchComponent } from './network-sketch/network-sketch.component';
import { NetworkSketchSheetComponent } from './network-sketch-sheet/network-sketch-sheet.component';


@NgModule({
  declarations: [
    BackgroundSketchComponent,
    NetworkComponent,
    NetworkControllerComponent,
    NetworkListComponent,
    NetworkNavbarComponent,
    NetworkSelectionComponent,
    NetworkSketchComponent,
    NetworkSketchSheetComponent,
  ],
  entryComponents: [
    NetworkSketchSheetComponent,
  ],
  exports: [
    BackgroundSketchComponent,
    NetworkComponent,
    NetworkControllerComponent,
    NetworkListComponent,
    NetworkNavbarComponent,
    NetworkSelectionComponent,
    NetworkSketchComponent,
    NetworkSketchSheetComponent,
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
