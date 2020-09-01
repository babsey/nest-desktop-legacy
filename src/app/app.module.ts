import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule
} from '@angular/platform-browser/animations';

// modules
import { ViewsModule } from './views/views.module';

import { AppComponent } from './views/app.component';


@NgModule({
  imports: [
    // NoopAnimationsModule,
    BrowserAnimationsModule,
    BrowserModule,
    ViewsModule,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule {}
