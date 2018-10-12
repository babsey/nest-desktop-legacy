import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConfigurationComponent } from './configuration/configuration.component';
import { NetworksComponent } from './networks/networks.component';
import { SimulationWorkspaceComponent } from './simulation-workspace/simulation-workspace.component';

const appRoutes: Routes = [
  { path: 'configuration', component: ConfigurationComponent },
  { path: 'networks', component: NetworksComponent },
  { path: 'simulation', component: SimulationWorkspaceComponent },
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
