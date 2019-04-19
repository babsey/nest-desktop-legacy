import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../modules/material.module';

import { NodeComponent } from './g-node/g-node.component';


@NgModule({
  declarations: [
    NodeComponent,
  ],
  exports: [
    NodeComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
  ]
})
export class AppNodeModule { }
