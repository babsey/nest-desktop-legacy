import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MccColorPickerModule } from 'material-community-components';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import * as PlotlyJS from 'plotly.js-cartesian-dist';
import { PlotlyModule } from 'angular-plotly.js';
PlotlyModule.plotlyjs = PlotlyJS;

import { AppPipesModule } from '../../pipes/pipes.module';

import { MaterialModule } from '../material.module';
import { AppFormsModule } from '../forms/forms.module';
import { ModelModule } from '../model/model.module';

import { NodeControllerComponent } from './node-controller/node-controller.component';
import { NodeListComponent } from './node-list/node-list.component';
import { NodeMenuComponent } from './node-menu/node-menu.component';
import { NodeParamComponent } from './node-param/node-param.component';
import { NodeSelectionComponent } from './node-selection/node-selection.component';
import { NodeShapeComponent } from './node-shape/node-shape.component';
import { NodeSketchComponent } from './node-sketch/node-sketch.component';
import { NodeSpatialComponent } from './node-spatial/node-spatial.component';
import { NodeToolbarComponent } from './node-toolbar/node-toolbar.component';


@NgModule({
  declarations: [
    NodeControllerComponent,
    NodeListComponent,
    NodeMenuComponent,
    NodeParamComponent,
    NodeSelectionComponent,
    NodeShapeComponent,
    NodeSketchComponent,
    NodeSpatialComponent,
    NodeToolbarComponent,
  ],
  exports: [
    NodeControllerComponent,
    NodeListComponent,
    NodeMenuComponent,
    NodeParamComponent,
    NodeSelectionComponent,
    NodeShapeComponent,
    NodeSketchComponent,
    NodeSpatialComponent,
    NodeToolbarComponent,
  ],
  imports: [
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
    PlotlyModule,
  ],
  providers: [],
})
export class NodeModule { }
