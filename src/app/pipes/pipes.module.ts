import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormatPipe } from './format/format.pipe';
import { TimedeltaPipe } from './timedelta/timedelta.pipe';
import { TimesincePipe } from './timesince/timesince.pipe';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    FormatPipe,
    TimedeltaPipe,
    TimesincePipe,
  ],
  exports: [
    FormatPipe,
    TimedeltaPipe,
    TimesincePipe,
  ]
})
export class AppPipesModule { }
