import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { MaterialModule } from '../material.module';

import { NestServerComponent } from './nest-server.component';
import { NestServerConfigComponent } from './nest-server-config/nest-server-config.component';


@NgModule({
  declarations: [
    NestServerComponent,
    NestServerConfigComponent,
  ],
  exports: [
    NestServerComponent,
    NestServerConfigComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    MaterialModule
  ]
})
export class NestServerModule { }
