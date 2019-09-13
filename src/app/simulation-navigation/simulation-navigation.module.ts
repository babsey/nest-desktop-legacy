import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MdePopoverModule } from '@material-extended/mde';

import { AppFormsModule } from '../forms/forms.module';
import { AppPipesModule } from '../pipes/pipes.module';
import { AppRoutingModule } from '../modules/app-routing.module';

import { LogModule } from '../log/log.module';
import { MaterialModule } from '../modules/material.module';
import { NetworkModule } from '../network/network.module';

import { SimulationListComponent } from './simulation-list/simulation-list.component';
import { SimulationNavigationComponent } from './simulation-navigation.component';
import { SimulationSelectionComponent } from './simulation-selection/simulation-selection.component';
import { SimulationShortListComponent } from './simulation-short-list/simulation-short-list.component';


@NgModule({
  declarations: [
    SimulationListComponent,
    SimulationNavigationComponent,
    SimulationSelectionComponent,
    SimulationShortListComponent,
  ],
  exports: [
    SimulationListComponent,
    SimulationNavigationComponent,
    SimulationSelectionComponent,
    SimulationShortListComponent,
  ],
  imports: [
    AppFormsModule,
    AppPipesModule,
    AppRoutingModule,
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    LogModule,
    MaterialModule,
    MdePopoverModule,
    NetworkModule,
  ]
})
export class SimulationNavigationModule { }
