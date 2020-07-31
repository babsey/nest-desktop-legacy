import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';
PlotlyModule.plotlyjs = PlotlyJS;

import { AppPipesModule } from '../../pipes/pipes.module';

import { MaterialModule } from '../material.module';

import { ArrayInputInlineComponent } from './array-input-inline/array-input-inline.component';
import { ArrayInputPopupComponent } from './array-input-popup/array-input-popup.component';
import { InputInlineComponent } from './input-inline/input-inline.component';
import { InputPopupComponent } from './input-popup/input-popup.component';
import { ParamRandomComponent } from './param-random/param-random.component';
import { SelectComponent } from './select/select.component';
import { SelectFilterComponent } from './select-filter/select-filter.component';
import { SelectOptgroupComponent } from './select-optgroup/select-optgroup.component';
import { TicksSliderInlineComponent } from './ticks-slider-inline/ticks-slider-inline.component';
import { TicksSliderPopupComponent } from './ticks-slider-popup/ticks-slider-popup.component';
import { ValueInputInlineComponent } from './value-input-inline/value-input-inline.component';
import { ValueInputPopupComponent } from './value-input-popup/value-input-popup.component';
import { ValueSliderInlineComponent } from './value-slider-inline/value-slider-inline.component';
import { ValueSliderPopupComponent } from './value-slider-popup/value-slider-popup.component';

import { ArrayGeneratorDialogComponent } from './array-generator-dialog/array-generator-dialog.component';


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
    ArrayInputInlineComponent,
    ArrayInputPopupComponent,
    InputInlineComponent,
    InputPopupComponent,
    ParamRandomComponent,
    SelectComponent,
    SelectFilterComponent,
    SelectOptgroupComponent,
    TicksSliderInlineComponent,
    TicksSliderPopupComponent,
    ValueInputInlineComponent,
    ValueInputPopupComponent,
    ValueSliderInlineComponent,
    ValueSliderPopupComponent,
  ],
  exports: [
    ArrayGeneratorDialogComponent,
    ArrayInputInlineComponent,
    ArrayInputPopupComponent,
    InputInlineComponent,
    InputPopupComponent,
    ParamRandomComponent,
    SelectComponent,
    SelectFilterComponent,
    SelectOptgroupComponent,
    TicksSliderInlineComponent,
    TicksSliderPopupComponent,
    ValueInputInlineComponent,
    ValueInputPopupComponent,
    ValueSliderInlineComponent,
    ValueSliderPopupComponent,
  ],
  entryComponents: [
    ArrayGeneratorDialogComponent,
  ],
})
export class AppFormsModule { }
