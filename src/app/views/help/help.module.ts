import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { MaterialModule } from '../material.module';
import { RoutesModule } from '../routes.module';

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
    CommonModule,
    FontAwesomeModule,
    MaterialModule,
    RoutesModule,
  ]
})
export class HelpModule { }
