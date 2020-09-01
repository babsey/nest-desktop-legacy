import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { MaterialModule } from '../material.module';
import { RoutesModule } from '../routes.module';

import { NavigationComponent } from './navigation.component';


@NgModule({
  exports: [
    NavigationComponent,
  ],
  declarations: [
    NavigationComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    MaterialModule,
    RoutesModule,
  ],
  providers: []
})
export class NavigationModule { }
