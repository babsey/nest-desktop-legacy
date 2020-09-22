import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MccColorPickerModule } from 'material-community-components/color-picker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import * as PlotlyJS from 'plotly.js-cartesian-dist';
import { PlotlyModule } from 'angular-plotly.js';
PlotlyModule.plotlyjs = PlotlyJS;

import { AppDirectivesModule } from '../../directives/directives.module';
import { AppPipesModule } from '../../pipes/pipes.module';

import { MaterialModule } from '../material.module';
import { AppFormsModule } from '../forms/forms.module';
import { ModelModule } from '../model/model.module';
import { NodeModule } from '../node/node.module';

import { ConnectionControllerComponent } from './connection-controller/connection-controller.component';
import { ConnectionListComponent } from './connection-list/connection-list.component';
import { ConnectionMenuComponent } from './connection-menu/connection-menu.component';
import { ConnectionMaskComponent } from './connection-mask/connection-mask.component';
import { ConnectionParamComponent } from './connection-param/connection-param.component';
import { ConnectionProjectionsComponent } from './connection-projections/connection-projections.component';
import { ConnectionSelectionComponent } from './connection-selection/connection-selection.component';
import { ConnectionSketchComponent } from './connection-sketch/connection-sketch.component';
import { ConnectionToolbarComponent } from './connection-toolbar/connection-toolbar.component';

@NgModule({
  declarations: [
    ConnectionControllerComponent,
    ConnectionMenuComponent,
    ConnectionListComponent,
    ConnectionMaskComponent,
    ConnectionParamComponent,
    ConnectionProjectionsComponent,
    ConnectionSelectionComponent,
    ConnectionSketchComponent,
    ConnectionToolbarComponent,
  ],
  exports: [
    ConnectionControllerComponent,
    ConnectionMenuComponent,
    ConnectionListComponent,
    ConnectionMaskComponent,
    ConnectionParamComponent,
    ConnectionProjectionsComponent,
    ConnectionSelectionComponent,
    ConnectionSketchComponent,
    ConnectionToolbarComponent,
  ],
  imports: [
    AppDirectivesModule,
    AppFormsModule,
    AppPipesModule,
    BrowserAnimationsModule,
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    MaterialModule,
    MccColorPickerModule.forRoot({
      used_colors: []
    }),
    ModelModule,
    NodeModule,
    PlotlyModule,
  ],
  providers: [],
})
export class ConnectionModule { }
