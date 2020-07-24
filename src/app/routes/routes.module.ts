import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HelpComponent } from '../help/help.component';
import { ModelComponent } from '../model/model.component';
import { ConfigComponent } from '../config/config.component';

import { ConfigListComponent } from '../config/config-list/config-list.component';
import { HelpListComponent } from '../help/help-list/help-list.component';
import { LoadingDetailsComponent } from '../loading/loading-details/loading-details.component';
import { ModelListComponent } from '../model/model-list/model-list.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { ProjectNavigationComponent } from '../project-navigation/project-navigation.component';
import { StartpageComponent } from '../startpage/startpage.component';
import { TestsuiteComponent } from '../testsuite/testsuite.component';

import { ProjectComponent } from '../project/project.component';


const appRoutes: Routes = [
  // { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '', component: StartpageComponent },
  { path: 'app', component: LoadingDetailsComponent, outlet: 'nav' },
  { path: 'setting', component: ConfigListComponent, outlet: 'nav' },
  { path: 'setting/:setting', component: ConfigComponent },
  { path: 'help', component: HelpListComponent, outlet: 'nav' },
  { path: 'help/:help', component: HelpComponent },
  { path: 'model', component: ModelListComponent, outlet: 'nav' },
  { path: 'model/:model', component: ModelComponent },
  { path: 'project', component: ProjectNavigationComponent, outlet: 'nav' },
  { path: 'project', component: ProjectComponent },
  { path: 'project/:id', component: ProjectComponent },
  { path: 'project/:id/run', component: ProjectComponent },
  { path: 'testsuite', component: TestsuiteComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        useHash: true,
        enableTracing: false,  // <-- debugging purposes only
      }
    )
  ],
  declarations: [
  ],
  exports: [
    RouterModule,
  ]
})
export class RoutesModule { }
