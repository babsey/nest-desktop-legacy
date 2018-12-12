import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackgroundSketchComponent } from './background-sketch/background-sketch.component';
import { LinkSketchComponent } from './link-sketch/link-sketch.component';
import { NodeSketchComponent } from './node-sketch/node-sketch.component';
import { SketchComponent } from './sketch.component';

import { SketchService } from './sketch.service';


@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    BackgroundSketchComponent,
    LinkSketchComponent,
    NodeSketchComponent,
    SketchComponent,
  ],
  providers: [
    SketchService,
  ],
  exports: [
    BackgroundSketchComponent,
    LinkSketchComponent,
    NodeSketchComponent,
    SketchComponent,
  ]
})
export class SketchModule { }
