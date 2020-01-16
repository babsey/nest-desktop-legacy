import '../../polyfills';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppFormsModule } from '../forms/forms.module';
import { AppPipesModule } from '../pipes/pipes.module';
import { AppRoutingModule } from '../modules/app-routing.module';

import { MaterialModule } from '../modules/material.module';
import { NetworkModule } from '../network/network.module';
import { VisualizationModule } from '../visualization/visualization.module';

import { SimulationComponent } from './simulation.component';
import { SimulationConfigComponent } from './simulation-config/simulation-config.component';
import { SimulationDetailsComponent } from './simulation-details/simulation-details.component';
import { SimulationPlaygroundComponent } from './simulation-playground/simulation-playground.component';
import { SimulationScriptComponent } from './simulation-script/simulation-script.component';
import { SimulationStatsComponent } from './simulation-stats/simulation-stats.component';

import { ControllerComponent } from './simulation-controller/simulation-controller.component';
import { KernelControllerComponent } from './simulation-controller/kernel-controller/kernel-controller.component';
import { SimulationControllerComponent } from './simulation-controller/simulation-controller/simulation-controller.component';

import { SimulationService } from './services/simulation.service';
import { SimulationProtocolService } from './services/simulation-protocol.service';
import { SimulationRunService } from './services/simulation-run.service';
import { SimulationControllerService } from './simulation-controller/simulation-controller.service';
import { SpikeStatsComponent } from './simulation-stats/spike-stats/spike-stats.component';
import { AnalogStatsComponent } from './simulation-stats/analog-stats/analog-stats.component';


@NgModule({
  declarations: [
    ControllerComponent,
    KernelControllerComponent,
    SimulationComponent,
    SimulationConfigComponent,
    SimulationControllerComponent,
    SimulationDetailsComponent,
    SimulationPlaygroundComponent,
    SimulationScriptComponent,
    SimulationStatsComponent,
    SpikeStatsComponent,
    AnalogStatsComponent,
  ],
  exports: [
    ControllerComponent,
    KernelControllerComponent,
    SimulationComponent,
    SimulationConfigComponent,
    SimulationControllerComponent,
    SimulationDetailsComponent,
    SimulationPlaygroundComponent,
    SimulationScriptComponent,
    SimulationStatsComponent,
  ],
  imports: [
    AppFormsModule,
    AppPipesModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    MaterialModule,
    NetworkModule,
    VisualizationModule,
  ],
  providers: [
    SimulationService,
    SimulationProtocolService,
    SimulationRunService,
    SimulationControllerService,
  ],
})
export class SimulationModule { }
