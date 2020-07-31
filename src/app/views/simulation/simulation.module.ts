import '../../../polyfills';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';

import { AppPipesModule } from '../../pipes/pipes.module';

import { MaterialModule } from '../material.module';
import { AppFormsModule } from '../forms/forms.module';

import { SimulationCodeEditorComponent } from './simulation-code-editor/simulation-code-editor.component';
import { SimulationConfigComponent } from './simulation-config/simulation-config.component';

import { KernelControllerComponent } from './kernel-controller/kernel-controller.component';
import { SimulationControllerComponent } from './simulation-controller/simulation-controller.component';


@NgModule({
  declarations: [
    KernelControllerComponent,
    SimulationCodeEditorComponent,
    SimulationConfigComponent,
    SimulationControllerComponent,
  ],
  exports: [
    KernelControllerComponent,
    SimulationCodeEditorComponent,
    SimulationConfigComponent,
    SimulationControllerComponent,
  ],
  imports: [
    AppFormsModule,
    AppPipesModule,
    BrowserAnimationsModule,
    CodemirrorModule,
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    MaterialModule,
  ],
  providers: [],
})
export class SimulationModule { }
