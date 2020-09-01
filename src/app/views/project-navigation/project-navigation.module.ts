import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MdePopoverModule } from '@material-extended/mde';

import { AppDirectivesModule } from '../../directives/directives.module';
import { AppPipesModule } from '../../pipes/pipes.module';

import { MaterialModule } from '../material.module';
import { RoutesModule } from '../routes.module';

import { AppFormsModule } from '../forms/forms.module';
import { LogModule } from '../log/log.module';
import { NetworkModule } from '../network/network.module';

import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectNavigationComponent } from './project-navigation.component';
import { ProjectRevisionListComponent } from './project-revision-list/project-revision-list.component';
import { ProjectSelectionComponent } from './project-selection/project-selection.component';
import { ProjectTimesinceComponent } from './project-timesince/project-timesince.component';



@NgModule({
  declarations: [
    ProjectListComponent,
    ProjectNavigationComponent,
    ProjectRevisionListComponent,
    ProjectSelectionComponent,
    ProjectTimesinceComponent,
  ],
  exports: [
    ProjectListComponent,
    ProjectNavigationComponent,
    ProjectRevisionListComponent,
    ProjectTimesinceComponent,
    ProjectSelectionComponent,
  ],
  imports: [
    AppDirectivesModule,
    AppFormsModule,
    AppPipesModule,
    BrowserAnimationsModule,
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    LogModule,
    MaterialModule,
    MdePopoverModule,
    NetworkModule,
    // RoutesModule,
  ]
})
export class ProjectNavigationModule { }
