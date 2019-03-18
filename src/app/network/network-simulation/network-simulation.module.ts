import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppFormsModule } from '../../forms/forms.module';
import { ChartModule } from '../../chart/chart.module';
import { ControllerModule } from '../../controller/controller.module';
import { MaterialModule } from '../../modules/material.module';
import { ViewModule } from '../../view/view.module';

import { NetworkSimulationComponent } from './network-simulation.component';
import { NetworkSimulationService } from './network-simulation.service';


@NgModule({
  imports: [
    AppFormsModule,
    ChartModule,
    CommonModule,
    ControllerModule,
    FlexLayoutModule,
    FontAwesomeModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    ViewModule,
  ],
  declarations: [
    NetworkSimulationComponent,
  ],
  exports: [
    NetworkSimulationComponent,
  ],
  providers: [
    NetworkSimulationService,
  ]
})
export class NetworkSimulationModule { }
