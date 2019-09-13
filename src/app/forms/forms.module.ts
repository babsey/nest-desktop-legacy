import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MaterialModule } from '../modules/material.module';
import { AppPipesModule } from '../pipes/pipes.module';

import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';
PlotlyModule.plotlyjs = PlotlyJS;

import { ArrayInputPopupComponent } from './array-input-popup/array-input-popup.component';
import { InputPopupComponent } from './input-popup/input-popup.component';
import { ParamSliderPopupComponent } from './param-slider-popup/param-slider-popup.component';
import { SelectComponent } from './select/select.component';
import { SelectOptgroupComponent } from './select-optgroup/select-optgroup.component';
import { SelectFilterComponent } from './select-filter/select-filter.component';
import { TicksSliderInlineComponent } from './ticks-slider-inline/ticks-slider-inline.component';
import { TicksSliderPopupComponent } from './ticks-slider-popup/ticks-slider-popup.component';
import { ValueInputInlineComponent } from './value-input-inline/value-input-inline.component';
import { ValueInputPopupComponent } from './value-input-popup/value-input-popup.component';
import { ValueSliderInlineComponent } from './value-slider-inline/value-slider-inline.component';
import { ValueSliderPopupComponent } from './value-slider-popup/value-slider-popup.component';

import { ArrayGeneratorDialogComponent } from './array-generator-dialog/array-generator-dialog.component';
import { FormsConfigDialogComponent } from './forms-config-dialog/forms-config-dialog.component';
import { ParamConfigComponent } from './param-config/param-config.component';

@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    AppPipesModule,
    PlotlyModule,
  ],
  declarations: [
    ArrayGeneratorDialogComponent,
    ArrayInputPopupComponent,
    FormsConfigDialogComponent,
    InputPopupComponent,
    ParamSliderPopupComponent,
    SelectComponent,
    SelectOptgroupComponent,
    SelectFilterComponent,
    TicksSliderInlineComponent,
    TicksSliderPopupComponent,
    ValueInputInlineComponent,
    ValueInputPopupComponent,
    ValueSliderInlineComponent,
    ValueSliderPopupComponent,
    ParamConfigComponent,
  ],
  exports: [
    ArrayGeneratorDialogComponent,
    ArrayInputPopupComponent,
    FormsConfigDialogComponent,
    InputPopupComponent,
    ParamSliderPopupComponent,
    SelectComponent,
    SelectOptgroupComponent,
    SelectFilterComponent,
    TicksSliderInlineComponent,
    TicksSliderPopupComponent,
    ValueInputInlineComponent,
    ValueInputPopupComponent,
    ValueSliderInlineComponent,
    ValueSliderPopupComponent,
  ],
  entryComponents: [
    ArrayGeneratorDialogComponent,
    FormsConfigDialogComponent,
  ],
})
export class AppFormsModule { }
