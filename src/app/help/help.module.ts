import { NgModule } from '@angular/core';
import { AppRoutingModule } from '../modules/app-routing.module';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { MaterialModule } from '../modules/material.module';

import { HelpComponent } from './help.component';
import { HelpListComponent } from './help-list/help-list.component';


@NgModule({
  declarations: [
    HelpComponent,
    HelpListComponent,
  ],
  exports: [
    HelpComponent,
    HelpListComponent,
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    MaterialModule,
    FontAwesomeModule,
  ]
})
export class HelpModule { }
