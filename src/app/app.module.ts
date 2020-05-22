import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule
} from '@angular/platform-browser/animations';

import { MccColorPickerModule } from 'material-community-components';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FlexLayoutModule } from "@angular/flex-layout";
import { ToastrModule } from 'ngx-toastr';

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
import { EmptyPageComponent } from './empty-page/empty-page.component';
import { LoadingComponent } from './loading/loading.component';
import { LoadingDetailsComponent } from './loading/loading-details/loading-details.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { StartpageComponent } from './startpage/startpage.component';
import { TestsuiteComponent } from './testsuite/testsuite.component';
import { ValidationCheckComponent } from './loading/validation-check/validation-check.component';
import { ResponseCheckComponent } from './loading/response-check/response-check.component';


@NgModule({
  declarations: [
    AppComponent,
    LoadingComponent,
    LoadingDetailsComponent,
    PageNotFoundComponent,
    StartpageComponent,
    TestsuiteComponent,
    EmptyPageComponent,
    ValidationCheckComponent,
    ResponseCheckComponent,
  ],
  imports: [
    // NoopAnimationsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    ConfigModule,
    FontAwesomeModule,
    HelpModule,
    FlexLayoutModule,
    MaterialModule,
    ModelModule,
    NavigationModule,
    NestServerModule,
    NetworkModule,
    SimulationModule,
    SimulationNavigationModule,
    ToastrModule.forRoot(),
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
