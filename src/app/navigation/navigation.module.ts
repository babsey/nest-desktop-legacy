import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from '../modules/app-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MaterialModule } from '../modules/material.module';

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
