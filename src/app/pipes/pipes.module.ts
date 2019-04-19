import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormatPipe } from './format/format.pipe';
import { TimedeltaPipe } from './timedelta/timedelta.pipe';
import { TimesincePipe } from './timesince/timesince.pipe';
import { CapitalizePipe } from './capitalize/capitalize.pipe';


@NgModule({
  declarations: [
    FormatPipe,
    TimedeltaPipe,
    TimesincePipe,
    CapitalizePipe,
  ],
  exports: [
    FormatPipe,
    TimedeltaPipe,
    TimesincePipe,
    CapitalizePipe,
  ],
  imports: [
    CommonModule
  ]
})
export class AppPipesModule { }
