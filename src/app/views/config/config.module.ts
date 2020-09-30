import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MccColorPickerModule } from 'material-community-components/color-picker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppPipesModule } from '../../pipes/pipes.module';

import { MaterialModule } from '../material.module';
import { RoutesModule } from '../routes.module';

import { ConfigComponent } from './config.component';
import { ConfigListComponent } from './config-list/config-list.component';

import { ActivityGraphConfigComponent } from './activity-graph-config/activity-graph-config.component';
import { AppConfigComponent } from './app-config/app-config.component';
import { ModelConfigComponent } from './model-config/model-config.component';
import { NetworkConfigComponent } from './network-config/network-config.component';
import { ProjectConfigComponent } from './project-config/project-config.component';
import { NestServerConfigComponent } from './nest-server-config/nest-server-config.component';


@NgModule({
  declarations: [
    ActivityGraphConfigComponent,
    AppConfigComponent,
    ConfigComponent,
    ConfigListComponent,
    ModelConfigComponent,
    NestServerConfigComponent,
    NetworkConfigComponent,
    ProjectConfigComponent,
  ],
  exports: [
    ActivityGraphConfigComponent,
    AppConfigComponent,
    ConfigComponent,
    ConfigListComponent,
    ModelConfigComponent,
    NestServerConfigComponent,
    NetworkConfigComponent,
    ProjectConfigComponent,
  ],
  imports: [
    AppPipesModule,
    BrowserAnimationsModule,
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    MaterialModule,
    RoutesModule,
    MccColorPickerModule.forRoot({
      used_colors: []
    }),
    ReactiveFormsModule,
  ],
  providers: [
  ]
})
export class ConfigModule { }
