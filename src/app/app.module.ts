import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule
} from '@angular/platform-browser/animations';
import { MccColorPickerModule } from 'material-community-components';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

// modules
import { AppRoutingModule } from './modules/app-routing.module';
import { MaterialModule } from './modules/material.module';

import { ConfigModule } from './config/config.module';
import { HelpModule } from './help/help.module';
import { ModelModule } from './model/model.module';
import { NavigationModule } from './navigation/navigation.module';
import { NestServerModule } from './nest-server/nest-server.module';
import { NetworkModule } from './network/network.module';
import { SimulationModule } from './simulation/simulation.module';
import { SimulationNavigationModule } from './simulation-navigation/simulation-navigation.module';
import { VisualizationModule } from './visualization/visualization.module';


// components
import { AppComponent } from './app.component';
import { LoadingComponent } from './loading/loading.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TestsuiteComponent } from './testsuite/testsuite.component';


@NgModule({
  declarations: [
    AppComponent,
    LoadingComponent,
    PageNotFoundComponent,
    TestsuiteComponent,
  ],
  imports: [
    // NoopAnimationsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    ConfigModule,
    FontAwesomeModule,
    HelpModule,
    MaterialModule,
    ModelModule,
    NavigationModule,
    NestServerModule,
    NetworkModule,
    SimulationModule,
    SimulationNavigationModule,
    VisualizationModule,
    MccColorPickerModule.forRoot({
      used_colors: []
    }),
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private library: FaIconLibrary,
  ) {
    library.addIconPacks(fas);
  }
}
