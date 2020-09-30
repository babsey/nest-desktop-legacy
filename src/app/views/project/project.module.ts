import '../../../polyfills';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';

import { AppDirectivesModule } from '../../directives/directives.module';
import { AppPipesModule } from '../../pipes/pipes.module';

import { MaterialModule } from '../material.module';
import { RoutesModule } from '../routes.module';

import { AppFormsModule } from '../forms/forms.module';
import { ActivityModule } from '../activity/activity.module';
import { NetworkModule } from '../network/network.module';
import { SimulationModule } from '../simulation/simulation.module';

import { ProjectComponent } from './project.component';
import { ProjectContainerComponent } from './project-container/project-container.component';
import { ProjectContentComponent } from './project-content/project-content.component';
import { ProjectRawDataComponent } from './project-raw-data/project-raw-data.component';
import { ProjectSidenavComponent } from './project-sidenav/project-sidenav.component';
import { ProjectSidenavTabsComponent } from './project-sidenav-tabs/project-sidenav-tabs.component';
import { ProjectToolbarComponent } from './project-toolbar/project-toolbar.component';


@NgModule({
  declarations: [
    ProjectComponent,
    ProjectContainerComponent,
    ProjectContentComponent,
    ProjectRawDataComponent,
    ProjectSidenavComponent,
    ProjectSidenavTabsComponent,
    ProjectToolbarComponent,
  ],
  exports: [
    ProjectComponent,
    ProjectContainerComponent,
    ProjectContentComponent,
    ProjectRawDataComponent,
    ProjectSidenavComponent,
    ProjectSidenavTabsComponent,
  ],
  imports: [
    ActivityModule,
    AppDirectivesModule,
    AppFormsModule,
    AppPipesModule,
    BrowserAnimationsModule,
    CodemirrorModule,
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    MaterialModule,
    NetworkModule,
    RoutesModule,
    SimulationModule,
  ],
  providers: [],
})
export class ProjectModule { }
