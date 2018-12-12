import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from '../main/main.component';
import { ModelComponent } from '../model/model.component';
import { ConfigComponent } from '../config/config.component';
import { ViewComponent } from '../view/view.component';
import { SimulationComponent } from '../simulation/simulation.component';

const appRoutes: Routes = [
  { path: '', component: MainComponent },
  { path: 'config/app', component: ConfigComponent },
  { path: 'config/model', component: ModelComponent },
  { path: 'view', component: ViewComponent },
  { path: 'simulate', component: SimulationComponent },
  { path: ':source/:id/view', component: ViewComponent },
  { path: ':source/:id/simulate', component: SimulationComponent },
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
