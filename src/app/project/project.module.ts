import '../../polyfills';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';

import { AppFormsModule } from '../forms/forms.module';
import { AppPipesModule } from '../pipes/pipes.module';
import { RoutesModule } from '../routes/routes.module';

import { MaterialModule } from '../modules/material.module';
import { NetworkModule } from '../network/network.module';
import { SimulationModule } from '../simulation/simulation.module';
import { VisualizationModule } from '../visualization/visualization.module';

import { ProjectComponent } from './project.component';
import { ProjectContainerComponent } from './project-container/project-container.component';
import { SimulationConfigComponent } from './simulation-config/simulation-config.component';
import { ActivityExplorerComponent } from './activity-explorer/activity-explorer.component';
import { ProjectRawDataComponent } from './project-raw-data/project-raw-data.component';
import { ActivityStatsComponent } from './activity-stats/activity-stats.component';
import { ProjectSidenavComponent } from './project-sidenav/project-sidenav.component';
import { ProjectSidenavContentComponent } from './project-sidenav-content/project-sidenav-content.component';
import { ProjectSidenavTabsComponent } from './project-sidenav-tabs/project-sidenav-tabs.component';
import { ProjectToolbarComponent } from './project-toolbar/project-toolbar.component';

import { SpikeStatsComponent } from './activity-stats/spike-stats/spike-stats.component';
import { AnalogStatsComponent } from './activity-stats/analog-stats/analog-stats.component';


@NgModule({
  declarations: [
    ProjectComponent,
    ProjectContainerComponent,
    SimulationConfigComponent,
    ActivityExplorerComponent,
    ProjectRawDataComponent,
    ProjectSidenavComponent,
    ProjectSidenavContentComponent,
    ProjectSidenavTabsComponent,
    ActivityStatsComponent,
    ProjectToolbarComponent,
    SpikeStatsComponent,
    AnalogStatsComponent,
  ],
  exports: [
    ProjectComponent,
    ProjectContainerComponent,
    SimulationConfigComponent,
    ActivityExplorerComponent,
    ProjectRawDataComponent,
    ProjectSidenavComponent,
    ProjectSidenavContentComponent,
    ProjectSidenavTabsComponent,
    ActivityStatsComponent,
    ProjectToolbarComponent,
  ],
  imports: [
    AppFormsModule,
    AppPipesModule,
    RoutesModule,
    BrowserAnimationsModule,
    CodemirrorModule,
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    MaterialModule,
    NetworkModule,
    SimulationModule,
    VisualizationModule,
  ],
  providers: [],
})
export class ProjectModule { }
