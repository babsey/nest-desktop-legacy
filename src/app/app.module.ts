// modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule
} from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';

// services
import { ChartService } from './shared/services/chart/chart.service';
import { ControllerService } from './shared/services/controller/controller.service';
import { DataService } from './shared/services/data/data.service';
import { GeneratorService } from './shared/services/generator/generator.service';
import { ModelService } from './shared/services/model/model.service';
import { NetworkService } from './shared/services/network/network.service';
import { ProtocolService } from './shared/services/protocol/protocol.service';
import { SimulationService } from './shared/services/simulation/simulation.service';
import { SketchService } from './shared/services/sketch/sketch.service';

// pipes
import { LabelPipe } from './shared/pipes/label/label.pipe';
import { MapToArrayPipe } from './shared/pipes/map-to-array/map-to-array.pipe';
import { TimesincePipe } from './shared/pipes/timesince/timesince.pipe';

// components
import { AppComponent } from './app.component';
import { ArrayInputComponent } from './array-input/array-input.component';
import { BackgroundSketchComponent } from './background-sketch/background-sketch.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { ControllerComponent } from './controller/controller.component';
import { KernelControllerComponent } from './kernel-controller/kernel-controller.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { LinkControllerComponent } from './link-controller/link-controller.component';
import { LinkSketchComponent } from './link-sketch/link-sketch.component';
import { ModelDescriptionComponent } from './model-description/model-description.component';
import { ModelDetailsComponent } from './model-details/model-details.component';
import { ModelEditComponent } from './model-edit/model-edit.component';
import { ModelListComponent } from './model-list/model-list.component';
import { NavigationComponent } from './navigation/navigation.component';
import { NetworkDetailsComponent } from './network-details/network-details.component';
import { NetworkListComponent } from './network-list/network-list.component';
import { NetworksComponent } from './networks/networks.component';
import { NodeControllerComponent } from './node-controller/node-controller.component';
import { NodeSketchComponent } from './node-sketch/node-sketch.component';
import { PointsComponent } from './points/points.component';
import { ScatterChartComponent } from './scatter-chart/scatter-chart.component';
import { SelectComponent } from './select/select.component';
import { SimulationControllerComponent } from './simulation-controller/simulation-controller.component';
import { SimulationWorkspaceComponent } from './simulation-workspace/simulation-workspace.component';
import { SketchComponent } from './sketch/sketch.component';
import { SpikeChartComponent } from './spike-chart/spike-chart.component';
import { TicksSliderComponent } from './ticks-slider/ticks-slider.component';
import { TraceChartComponent } from './trace-chart/trace-chart.component';
import { TreeViewComponent } from './tree-view/tree-view.component';
import { ValueInputComponent } from './value-input/value-input.component';
import { ValueSliderComponent } from './value-slider/value-slider.component';

// dialogs
import { ArrayGeneratorDialogComponent } from './shared/dialogs/array-generator-dialog/array-generator-dialog.component';
import { ConfigEditComponent } from './config-edit/config-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    ArrayGeneratorDialogComponent,
    ArrayInputComponent,
    BackgroundSketchComponent,
    ConfigurationComponent,
    ControllerComponent,
    KernelControllerComponent,
    LabelPipe,
    LineChartComponent,
    LinkControllerComponent,
    LinkSketchComponent,
    MapToArrayPipe,
    ModelDescriptionComponent,
    ModelDetailsComponent,
    ModelEditComponent,
    ModelListComponent,
    NavigationComponent,
    NetworkDetailsComponent,
    NetworkListComponent,
    NetworksComponent,
    NodeControllerComponent,
    NodeSketchComponent,
    PointsComponent,
    ScatterChartComponent,
    SelectComponent,
    SimulationControllerComponent,
    SimulationWorkspaceComponent,
    SketchComponent,
    SpikeChartComponent,
    TicksSliderComponent,
    TimesincePipe,
    TraceChartComponent,
    TreeViewComponent,
    ValueInputComponent,
    ValueSliderComponent,
    ConfigEditComponent,
  ],
  imports: [
    AppRoutingModule,
    // BrowserAnimationsModule,
    BrowserModule,
    FontAwesomeModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    NgbModule,
    NoopAnimationsModule,
    ReactiveFormsModule,
  ],
  entryComponents: [
    ArrayGeneratorDialogComponent,
  ],
  providers: [
    ChartService,
    ControllerService,
    DataService,
    GeneratorService,
    ModelService,
    NetworkService,
    ProtocolService,
    SimulationService,
    SketchService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
