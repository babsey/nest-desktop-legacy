import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HelpComponent } from '../help/help.component';
import { ModelComponent } from '../model/model.component';
import { ConfigComponent } from '../config/config.component';
import { SimulationComponent } from '../simulation/simulation.component';
import { NetworkComponent } from '../network/network.component';

import { ConfigListComponent } from '../config/config-list/config-list.component';
import { HelpListComponent } from '../help/help-list/help-list.component';
import { LoadingDetailsComponent } from '../loading/loading-details/loading-details.component';
import { ModelListComponent } from '../model/model-list/model-list.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { SimulationNavigationComponent } from '../simulation-navigation/simulation-navigation.component';
import { StartpageComponent } from '../startpage/startpage.component';
import { TestsuiteComponent } from '../testsuite/testsuite.component';


const appRoutes: Routes = [
  // { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '', component: StartpageComponent },
  { path: 'app', component: LoadingDetailsComponent, outlet: 'nav', data: { animation: 'home' } },
  { path: 'config', component: ConfigListComponent, outlet: 'nav', data: { animation: 'config' } },
  { path: 'config/:config', component: ConfigComponent, data: { animation: 'config' } },
  { path: 'help', component: HelpListComponent, outlet: 'nav' },
  { path: 'help/:help', component: HelpComponent },
  { path: 'model', component: ModelListComponent, outlet: 'nav', data: { animation: 'model' } },
  { path: 'model/:model', component: ModelComponent, data: { animation: 'model' } },
  { path: 'network', component: NetworkComponent, data: { animation: 'network' } },
  { path: 'network/:id', component: NetworkComponent, data: { animation: 'network' } },
  { path: 'simulation', component: SimulationNavigationComponent, outlet: 'nav', data: { animation: 'simulation' } },
  { path: 'simulation', component: SimulationComponent, data: { animation: 'simulation' } },
  { path: 'simulation/:id', component: SimulationComponent, data: { animation: 'simulation' } },
  { path: 'simulation/:id/run', component: SimulationComponent, data: { animation: 'simulation' } },
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
  declarations: [],
  exports: [
    RouterModule,
  ]
})
export class AppRoutingModule { }
