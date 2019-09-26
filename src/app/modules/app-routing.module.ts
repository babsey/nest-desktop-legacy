import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HelpComponent } from '../help/help.component';
import { ModelComponent } from '../model/model.component';
import { ConfigComponent } from '../config/config.component';
import { SimulationComponent } from '../simulation/simulation.component';
import { NetworkComponent } from '../network/network.component';

import { HelpListComponent } from '../help/help-list/help-list.component';
import { ConfigListComponent } from '../config/config-list/config-list.component';
import { ModelListComponent } from '../model/model-list/model-list.component';
import { SimulationNavigationComponent } from '../simulation-navigation/simulation-navigation.component';


const appRoutes: Routes = [
  { path: '',   redirectTo: '/(nav:simulation)', pathMatch: 'full' },
  { path: 'config', component: ConfigListComponent, outlet: 'nav'},
  { path: 'config/:config', component: ConfigComponent },
  { path: 'help', component: HelpListComponent , outlet: 'nav'},
  { path: 'help/:help', component: HelpComponent },
  { path: 'model', component: ModelListComponent , outlet: 'nav'},
  { path: 'model/:model', component: ModelComponent },
  { path: 'network', component: NetworkComponent },
  { path: 'network/:id', component: NetworkComponent },
  { path: 'simulation', component: SimulationNavigationComponent, outlet: 'nav'},
  { path: 'simulation', component: SimulationComponent },
  { path: 'simulation/:id', component: SimulationComponent },
  { path: 'simulation/:id/run', component: SimulationComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        useHash: true,
        enableTracing: false  // <-- debugging purposes only
      }
    )
  ],
  declarations: [],
  exports: [
    RouterModule,
  ]
})
export class AppRoutingModule { }
