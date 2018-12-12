import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MaterialModule } from '../modules/material.module';

import { ArrayGeneratorDialogComponent } from '../dialogs/array-generator-dialog/array-generator-dialog.component';
import { ArrayInputComponent } from './array-input/array-input.component';
import { SelectComponent } from './select/select.component';
import { TicksSliderComponent } from './ticks-slider/ticks-slider.component';
import { ValueInputComponent } from './value-input/value-input.component';
import { ValueSliderComponent } from './value-slider/value-slider.component';

import { AppPipesModule } from '../pipes/pipes.module';


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
    SelectComponent,
    TicksSliderComponent,
    ValueInputComponent,
    ValueSliderComponent,
  ],
  exports: [
    ArrayGeneratorDialogComponent,
    ArrayInputComponent,
    SelectComponent,
    TicksSliderComponent,
    ValueInputComponent,
    ValueSliderComponent,
  ],
  entryComponents: [
    ArrayGeneratorDialogComponent,
  ],
})
export class AppFormsModule { }
