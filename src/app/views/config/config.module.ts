import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MccColorPickerModule } from 'material-community-components';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppPipesModule } from '../../pipes/pipes.module';

import { MaterialModule } from '../material.module';
import { RoutesModule } from '../routes.module';

import { ModelModule } from '../model/model.module';
import { NestServerModule } from '../nest-server/nest-server.module';
import { NetworkModule } from '../network/network.module';
import { SimulationModule } from '../simulation/simulation.module';
import { ActivityModule } from '../activity/activity.module';

import { AppConfigComponent } from './app-config/app-config.component';
import { ConfigComponent } from './config.component';
import { ConfigListComponent } from './config-list/config-list.component';


@NgModule({
  declarations: [
    AppConfigComponent,
    ConfigComponent,
    ConfigListComponent,
  ],
  exports: [
    AppConfigComponent,
    ConfigComponent,
    ConfigListComponent,
  ],
  imports: [
    AppPipesModule,
    BrowserAnimationsModule,
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    MaterialModule,
    ModelModule,
    NestServerModule,
    NetworkModule,
    RoutesModule,
    SimulationModule,
    ActivityModule,
    MccColorPickerModule.forRoot({
      used_colors: []
    }),
    ReactiveFormsModule,
  ],
  providers: [
  ]
})
export class ConfigModule { }
