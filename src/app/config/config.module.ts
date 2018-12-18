import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MaterialModule } from '../modules/material.module';

import { ConfigComponent } from './config.component';

import { ConfigService } from './config.service';


@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ConfigComponent,
  ],
  providers: [
    ConfigService,
  ],
  exports: [
    ConfigComponent,
  ]
})
export class ConfigModule { }
