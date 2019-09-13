import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MccColorPickerModule } from 'material-community-components';

import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';
PlotlyModule.plotlyjs = PlotlyJS;

import { AppFormsModule } from '../forms/forms.module';
import { AppPipesModule } from '../pipes/pipes.module';
import { MaterialModule } from '../modules/material.module';

import { BackgroundSketchComponent } from './network-sketch/background-sketch/background-sketch.component';
import { LinkControllerComponent } from './network-controller/link-controller/link-controller.component';
import { LinkListComponent } from './network-list/link-list/link-list.component';
import { LinkMaskComponent } from './link-mask/link-mask.component';
import { LinkSelectionComponent } from './network-selection/link-selection/link-selection.component';
import { LinkSketchComponent } from './link-sketch/link-sketch.component';
import { LinksSketchComponent } from './network-sketch/links-sketch/links-sketch.component';
import { NetworkComponent } from './network.component';
import { NetworkConfigComponent } from './network-config/network-config.component';
import { NetworkControllerComponent } from './network-controller/network-controller.component';
import { NetworkListComponent } from './network-list/network-list.component';
import { NetworkSelectionComponent } from './network-selection/network-selection.component';
import { NetworkSketchComponent } from './network-sketch/network-sketch.component';
import { NetworkSketchService } from './network-sketch/network-sketch.service';
import { NetworkSketchSheetComponent } from './network-sketch-sheet/network-sketch-sheet.component';
import { NodeControllerComponent } from './network-controller/node-controller/node-controller.component';
import { NodeListComponent } from './network-list/node-list/node-list.component';
import { NodeSelectionComponent } from './network-selection/node-selection/node-selection.component';
import { NodeShapeComponent } from './node-shape/node-shape.component';
import { NodeSpatialComponent } from './node-spatial/node-spatial.component';
import { NodesSketchComponent } from './network-sketch/nodes-sketch/nodes-sketch.component';


@NgModule({
  declarations: [
    BackgroundSketchComponent,
    NetworkSketchSheetComponent,
    LinkControllerComponent,
    LinkMaskComponent,
    LinkSelectionComponent,
    LinkListComponent,
    LinksSketchComponent,
    LinkSketchComponent,
    NetworkComponent,
    NetworkConfigComponent,
    NetworkControllerComponent,
    NetworkListComponent,
    NetworkSelectionComponent,
    NetworkSketchComponent,
    NodeControllerComponent,
    NodeSelectionComponent,
    NodeShapeComponent,
    NodeListComponent,
    NodeSpatialComponent,
    NodesSketchComponent,
  ],
  entryComponents: [
    NetworkSketchSheetComponent,
  ],
  exports: [
    BackgroundSketchComponent,
    NetworkSketchSheetComponent,
    LinkControllerComponent,
    LinkMaskComponent,
    LinkSelectionComponent,
    LinkListComponent,
    LinksSketchComponent,
    LinkSketchComponent,
    NetworkComponent,
    NetworkConfigComponent,
    NetworkControllerComponent,
    NetworkListComponent,
    NetworkSelectionComponent,
    NetworkSketchComponent,
    NodeControllerComponent,
    NodeSelectionComponent,
    NodeSpatialComponent,
    NodeShapeComponent,
    NodeListComponent,
    NodesSketchComponent,
  ],
  imports: [
    AppFormsModule,
    AppPipesModule,
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    MaterialModule,
    MccColorPickerModule.forRoot({
      used_colors: []
    }),
    PlotlyModule,
  ],
  providers: [
    NetworkSketchService,
  ]
})
export class NetworkModule { }
