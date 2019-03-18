import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HelpComponent } from '../help/help.component';
import { ModelComponent } from '../model/model.component';
import { ConfigComponent } from '../config/config.component';
import { DBConfigComponent } from '../config/db-config/db-config.component';
import { NetworkComponent } from '../network/network.component';

import { HelpListComponent } from '../help/help-list/help-list.component';
import { ConfigListComponent } from '../config/config-list/config-list.component';
import { ModelListComponent } from '../model/model-list/model-list.component';
import { NetworkListComponent } from '../network/network-list/network-list.component';

const appRoutes: Routes = [
  { path: 'config', component: ConfigListComponent, outlet: 'sidebar'},
  { path: 'config/:config', component: ConfigComponent },
  { path: 'help', component: HelpListComponent , outlet: 'sidebar'},
  { path: 'help/:help', component: HelpComponent },
  { path: 'model', component: ModelListComponent , outlet: 'sidebar'},
  { path: 'model/:model', component: ModelComponent },
  { path: 'network', component: NetworkListComponent, outlet: 'sidebar'},
  { path: 'network', component: NetworkComponent },
  { path: 'network/:id', component: NetworkComponent },
  { path: 'network/:id/simulate', component: NetworkComponent },
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
