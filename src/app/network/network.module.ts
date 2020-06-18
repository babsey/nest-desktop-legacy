import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MccColorPickerModule } from 'material-community-components';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';
PlotlyModule.plotlyjs = PlotlyJS;

import { AppFormsModule } from '../forms/forms.module';
import { AppPipesModule } from '../pipes/pipes.module';
import { MaterialModule } from '../modules/material.module';
import { ModelModule } from '../model/model.module';

import { BackgroundSketchComponent } from './network-sketch/background-sketch/background-sketch.component';

import { LinkControllerComponent } from './link/link-controller/link-controller.component';
import { LinkListComponent } from './link/link-list/link-list.component';
import { LinkMenuComponent } from './link/link-menu/link-menu.component';
import { LinkMaskComponent } from './link/link-mask/link-mask.component';
import { LinkParamComponent } from './link/link-param/link-param.component';
import { LinkProjectionsComponent } from './link/link-projections/link-projections.component';
import { LinkSelectionComponent } from './link/link-selection/link-selection.component';
import { LinkSketchComponent } from './link/link-sketch/link-sketch.component';
import { LinkToolbarComponent } from './link/link-toolbar/link-toolbar.component';

import { NetworkClearDialogComponent } from './network-clear-dialog/network-clear-dialog.component';
import { NetworkComponent } from './network.component';
import { NetworkConfigComponent } from './network-config/network-config.component';
import { NetworkControllerComponent } from './network-controller/network-controller.component';
import { NetworkListComponent } from './network-list/network-list.component';
import { NetworkSelectionComponent } from './network-selection/network-selection.component';
import { NetworkSketchComponent } from './network-sketch/network-sketch.component';
import { NetworkSketchService } from './network-sketch/network-sketch.service';
import { NetworkSketchControllerComponent } from './network-sketch-controller/network-sketch-controller.component';
import { NetworkSketchSheetComponent } from './network-sketch-sheet/network-sketch-sheet.component';

import { NetworkNavbarComponent } from './network-navbar/network-navbar.component';
import { NodeControllerComponent } from './node/node-controller/node-controller.component';
import { NodeListComponent } from './node/node-list/node-list.component';
import { NodeMenuComponent } from './node/node-menu/node-menu.component';
import { NodeParamComponent } from './node/node-param/node-param.component';
import { NodeSelectionComponent } from './node/node-selection/node-selection.component';
import { NodeShapeComponent } from './node/node-shape/node-shape.component';
import { NodeSketchComponent } from './node/node-sketch/node-sketch.component';
import { NodeSpatialComponent } from './node/node-spatial/node-spatial.component';
import { NodeToolbarComponent } from './node/node-toolbar/node-toolbar.component';


@NgModule({
  declarations: [
    BackgroundSketchComponent,
    LinkControllerComponent,
    LinkMenuComponent,
    LinkListComponent,
    LinkMaskComponent,
    LinkParamComponent,
    LinkProjectionsComponent,
    LinkSelectionComponent,
    LinkSketchComponent,
    LinkToolbarComponent,
    NetworkClearDialogComponent,
    NetworkComponent,
    NetworkConfigComponent,
    NetworkControllerComponent,
    NetworkListComponent,
    NetworkNavbarComponent,
    NetworkSelectionComponent,
    NetworkSketchComponent,
    NetworkSketchControllerComponent,
    NetworkSketchSheetComponent,
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
  entryComponents: [
    NetworkClearDialogComponent,
    NetworkSketchSheetComponent,
  ],
  exports: [
    BackgroundSketchComponent,
    LinkControllerComponent,
    LinkMenuComponent,
    LinkListComponent,
    LinkMaskComponent,
    LinkParamComponent,
    LinkProjectionsComponent,
    LinkSelectionComponent,
    LinkSketchComponent,
    LinkToolbarComponent,
    NetworkClearDialogComponent,
    NetworkComponent,
    NetworkConfigComponent,
    NetworkControllerComponent,
    NetworkListComponent,
    NetworkNavbarComponent,
    NetworkSelectionComponent,
    NetworkSketchComponent,
    NetworkSketchSheetComponent,
    NetworkSketchControllerComponent,
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
  providers: [
    NetworkSketchService,
  ],
})
export class NetworkModule { }
