import { NgModule } from '@angular/core';
import { AppPipesModule } from '../pipes/pipes.module';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MaterialModule } from '../modules/material.module';

import { LogComponent } from './log.component';


@NgModule({
  declarations: [
    LogComponent,
  ],
  exports: [
    LogComponent,
  ],
  imports: [
    AppPipesModule,
    CommonModule,
    FontAwesomeModule,
    MaterialModule,
  ]
})
export class LogModule { }
