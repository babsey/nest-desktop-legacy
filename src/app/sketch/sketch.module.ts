import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../modules/material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


import { AppNodeModule } from '../node/node.module';

import { BackgroundSketchComponent } from './background-sketch/background-sketch.component';
import { LinkSketchComponent } from './link-sketch/link-sketch.component';
import { NodeSketchComponent } from './node-sketch/node-sketch.component';
import { SketchComponent } from './sketch.component';

import { SketchService } from './sketch.service';


@NgModule({
  declarations: [
    BackgroundSketchComponent,
    LinkSketchComponent,
    NodeSketchComponent,
    SketchComponent,
  ],
  exports: [
    BackgroundSketchComponent,
    LinkSketchComponent,
    NodeSketchComponent,
    SketchComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    MaterialModule,
    AppNodeModule,
  ],
  providers: [
    SketchService,
  ]
})
export class SketchModule { }
