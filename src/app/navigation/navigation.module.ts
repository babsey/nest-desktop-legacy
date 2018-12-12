import { AppPipesModule } from '../pipes/pipes.module';
import { AppRoutingModule } from '../modules/app-routing.module';
import { CommonModule } from '@angular/common';
import { ConfigModule } from '../config/config.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MaterialModule } from '../modules/material.module';
import { MdePopoverModule } from '@material-extended/mde';
import { ModelModule } from '../model/model.module';
import { NgModule } from '@angular/core';
import { SketchModule } from '../sketch/sketch.module';
import { ViewModule } from '../view/view.module';

import { ConfigListComponent } from './config-list/config-list.component';
import { ModelListComponent } from './model-list/model-list.component';
import { NetworkListComponent } from './network-list/network-list.component';
import { ProtocolListComponent } from './protocol-list/protocol-list.component';
import { NavigationComponent } from './navigation.component';

import { NavigationService } from './navigation.service';
import { MainListComponent } from './main-list/main-list.component';

@NgModule({
  imports: [
    AppPipesModule,
    AppRoutingModule,
    CommonModule,
    ConfigModule,
    FlexLayoutModule,
    FontAwesomeModule,
    MaterialModule,
    MdePopoverModule,
    ModelModule,
    SketchModule,
    ViewModule,
  ],
  declarations: [
    ConfigListComponent,
    ModelListComponent,
    NavigationComponent,
    NetworkListComponent,
    ProtocolListComponent,
    MainListComponent,
  ],
  providers: [
    NavigationService,
  ],
  exports: [
    ConfigListComponent,
    ModelListComponent,
    NavigationComponent,
    NetworkListComponent,
    ProtocolListComponent,
  ]
})
export class NavigationModule { }
