import { AppPipesModule } from '../pipes/pipes.module';
import { AppRoutingModule } from '../modules/app-routing.module';
import { CommonModule } from '@angular/common';
import { MdePopoverModule } from '@material-extended/mde';
import { NgModule } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MaterialModule } from '../modules/material.module';
import { SketchModule } from '../sketch/sketch.module';
import { ViewModule } from '../view/view.module';
import { NetworkSimulationModule } from './network-simulation/network-simulation.module';

import { NetworkComponent } from './network.component';
import { NetworkDetailsComponent } from './network-details/network-details.component';
import { NetworkListComponent } from './network-list/network-list.component';

import { NetworkService } from './network.service';
import { NetworkProtocolService } from './network-protocol/network-protocol.service';
import { NetworkScriptComponent } from './network-script/network-script.component';

@NgModule({
  declarations: [
    NetworkComponent,
    NetworkDetailsComponent,
    NetworkListComponent,
    NetworkScriptComponent,
  ],
  exports: [
    NetworkComponent,
    NetworkDetailsComponent,
    NetworkListComponent,
  ],
  imports: [
    AppPipesModule,
    AppRoutingModule,
    CommonModule,
    FontAwesomeModule,
    MaterialModule,
    MdePopoverModule,
    NetworkSimulationModule,
    SketchModule,
    ViewModule,
  ]
})
export class NetworkModule { }
