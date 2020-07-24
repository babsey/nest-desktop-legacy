import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MaterialModule } from '../modules/material.module';
import { RoutesModule } from '../routes/routes.module';

import { NavigationComponent } from './navigation.component';

import { NavigationService } from './navigation.service';

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
  providers: [
    NavigationService,
  ]
})
export class NavigationModule { }
