import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MaterialModule } from '../modules/material.module';
import { AppPipesModule } from '../pipes/pipes.module';

import { ArrayInputComponent } from './array-input/array-input.component';
import { ParamInputComponent } from './param-input/param-input.component';
import { ParamTicksSliderComponent } from './param-ticks-slider/param-ticks-slider.component';
import { ParamValueSliderComponent } from './param-value-slider/param-value-slider.component';
import { SelectComponent } from './select/select.component';
import { TicksSliderComponent } from './ticks-slider/ticks-slider.component';
import { ValueInputComponent } from './value-input/value-input.component';
import { ValueSliderComponent } from './value-slider/value-slider.component';

import { ArrayGeneratorDialogComponent } from './array-generator-dialog/array-generator-dialog.component';
import { FormsConfigDialogComponent } from './forms-config-dialog/forms-config-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    AppPipesModule,
  ],
  declarations: [
    ArrayGeneratorDialogComponent,
    ArrayInputComponent,
    FormsConfigDialogComponent,
    ParamInputComponent,
    ParamTicksSliderComponent,
    ParamValueSliderComponent,
    SelectComponent,
    TicksSliderComponent,
    ValueInputComponent,
    ValueSliderComponent,
  ],
  exports: [
    ArrayGeneratorDialogComponent,
    ArrayInputComponent,
    ParamInputComponent,
    ParamTicksSliderComponent,
    ParamValueSliderComponent,
    SelectComponent,
    TicksSliderComponent,
    ValueInputComponent,
    ValueSliderComponent,
  ],
  entryComponents: [
    ArrayGeneratorDialogComponent,
    FormsConfigDialogComponent,
  ],
})
export class AppFormsModule { }
