import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MaterialModule } from '../modules/material.module';
import { AppFormsModule } from '../forms/forms.module';
import { SketchModule } from '../sketch/sketch.module';

import { ControllerComponent } from './controller.component';
import { ControllerSheetComponent } from './controller-sheet/controller-sheet.component';
import { KernelControllerComponent } from './kernel-controller/kernel-controller.component';
import { LinkControllerComponent } from './link-controller/link-controller.component';
import { NodeControllerComponent } from './node-controller/node-controller.component';
import { SimulationControllerComponent } from './simulation-controller/simulation-controller.component';

import { ControllerService } from './controller.service';


@NgModule({
  imports: [
    AppFormsModule,
    CommonModule,
    FontAwesomeModule,
    MaterialModule,
    SketchModule,
  ],
  declarations: [
    ControllerComponent,
    ControllerSheetComponent,
    KernelControllerComponent,
    LinkControllerComponent,
    NodeControllerComponent,
    SimulationControllerComponent,
  ],
  exports: [
    ControllerComponent,
    ControllerSheetComponent,
    KernelControllerComponent,
    LinkControllerComponent,
    NodeControllerComponent,
    SimulationControllerComponent,
  ],
  providers: [
    ControllerService,
  ],
  entryComponents: [
    ControllerSheetComponent,
  ]
})
export class ControllerModule { }
