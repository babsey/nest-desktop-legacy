import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../modules/material.module';
import { NgModule } from '@angular/core';

import { ConfigComponent } from './config.component';

import { ConfigService } from './config.service';
import { MccColorPickerModule } from 'material-community-components';


@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    MaterialModule,
    MccColorPickerModule.forRoot({
      used_colors: []
    }),
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
