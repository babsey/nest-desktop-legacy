import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule
} from '@angular/platform-browser/animations';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
library.add(fas);


// modules
import { AppRoutingModule } from './modules/app-routing.module';
import { ConfigModule } from './config/config.module';
import { HelpModule } from './help/help.module';
import { LogModule } from './log/log.module';
import { MaterialModule } from './modules/material.module';
import { MccColorPickerModule } from 'material-community-components';
import { ModelModule } from './model/model.module';
import { NavigationModule } from './navigation/navigation.module';
import { NetworkModule } from './network/network.module';


// components
import { AppComponent } from './app.component';
import { LoadingComponent } from './loading/loading.component';


@NgModule({
  declarations: [
    AppComponent,
    LoadingComponent,
  ],
  imports: [
    // NoopAnimationsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    ConfigModule,
    FontAwesomeModule,
    HelpModule,
    LogModule,
    MaterialModule,
    ModelModule,
    NavigationModule,
    NetworkModule,
    MccColorPickerModule.forRoot({
      used_colors: []
    }),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
