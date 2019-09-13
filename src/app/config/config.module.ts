import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MccColorPickerModule } from 'material-community-components';

import { AppRoutingModule } from '../modules/app-routing.module';
import { MaterialModule } from '../modules/material.module';
import { NetworkModule } from '../network/network.module';
import { SimulationModule } from '../simulation/simulation.module';
import { VisualizationModule } from '../visualization/visualization.module';
import { AppPipesModule } from '../pipes/pipes.module';

import { AppConfigComponent } from './app-config/app-config.component';
import { ConfigComponent } from './config.component';
import { ConfigListComponent } from './config-list/config-list.component';
import { DBConfigComponent } from './db-config/db-config.component';

import { AppConfigService } from './app-config/app-config.service';


@NgModule({
  declarations: [
    AppConfigComponent,
    ConfigComponent,
    ConfigListComponent,
    DBConfigComponent,
  ],
  exports: [
    AppConfigComponent,
    ConfigComponent,
    ConfigListComponent,
    DBConfigComponent,
  ],
  imports: [
    AppPipesModule,
    AppRoutingModule,
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    MaterialModule,
    NetworkModule,
    SimulationModule,
    VisualizationModule,
    MccColorPickerModule.forRoot({
      used_colors: []
    }),
    ReactiveFormsModule,
  ],
  providers: [
    AppConfigService,
  ]
})
export class ConfigModule { }
