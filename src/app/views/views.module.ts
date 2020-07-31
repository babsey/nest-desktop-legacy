import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FlexLayoutModule } from "@angular/flex-layout";
import { ToastrModule } from 'ngx-toastr';

// modules
import { RoutesModule } from './routes.module';
import { MaterialModule } from './material.module';

import { ActivityModule } from './activity/activity.module';
import { ConfigModule } from './config/config.module';
import { HelpModule } from './help/help.module';
import { ModelModule } from './model/model.module';
import { NavigationModule } from './navigation/navigation.module';
import { NestServerModule } from './nest-server/nest-server.module';
import { NetworkModule } from './network/network.module';
import { ProjectModule } from './project/project.module';
import { ProjectNavigationModule } from './project-navigation/project-navigation.module';
import { SimulationModule } from './simulation/simulation.module';


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
    ActivityModule,
    BrowserModule,
    ConfigModule,
    FlexLayoutModule,
    FontAwesomeModule,
    HelpModule,
    MaterialModule,
    ModelModule,
    NavigationModule,
    NestServerModule,
    NetworkModule,
    ProjectModule,
    ProjectNavigationModule,
    RoutesModule,
    SimulationModule,
    ToastrModule.forRoot(),
  ]
})
export class ViewsModule {
  constructor(
    private library: FaIconLibrary,
  ) {
    library.addIconPacks(fas);
  }
}
