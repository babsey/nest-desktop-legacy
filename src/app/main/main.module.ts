import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../modules/material.module';

import { MainComponent } from './main.component';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [
    MainComponent,
  ]
})
export class MainModule { }
