import { AppRoutingModule } from '../modules/app-routing.module';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MaterialModule } from '../modules/material.module';
import { NgModule } from '@angular/core';

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
    AppRoutingModule,
    CommonModule,
    FontAwesomeModule,
    MaterialModule,
  ],
  providers: [
    NavigationService,
  ]
})
export class NavigationModule { }
