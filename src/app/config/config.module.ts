import { NgModule } from '@angular/core';
import { AppRoutingModule } from '../modules/app-routing.module';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../modules/material.module';
import { MccColorPickerModule } from 'material-community-components';

import { AppConfigComponent } from './app-config/app-config.component';
import { ConfigComponent } from './config.component';
import { ConfigListComponent } from './config-list/config-list.component';
import { ControllerConfigComponent } from './controller-config/controller-config.component';
import { DBConfigComponent } from './db-config/db-config.component';

import { AppConfigService } from './app-config/app-config.service';
import { ControllerConfigService } from './controller-config/controller-config.service';


@NgModule({
  declarations: [
    AppConfigComponent,
    ConfigComponent,
    ConfigListComponent,
    ControllerConfigComponent,
    DBConfigComponent,
  ],
  exports: [
    AppConfigComponent,
    ConfigComponent,
    ConfigListComponent,
    ControllerConfigComponent,
    DBConfigComponent,
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    MaterialModule,
    MccColorPickerModule.forRoot({
      used_colors: []
    }),
    ReactiveFormsModule,
  ],
  providers: [
    AppConfigService,
    ControllerConfigService,
  ]
})
export class ConfigModule { }
