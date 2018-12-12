import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimesincePipe } from './timesince/timesince.pipe';
import { LabelPipe } from './label/label.pipe';
import { FormatPipe } from './format/format.pipe';
import { ParamsPipe } from './params/params.pipe';
import { NodesPipe } from './nodes/nodes.pipe';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    FormatPipe,
    LabelPipe,
    NodesPipe,
    ParamsPipe,
    TimesincePipe,
  ],
  exports: [
    FormatPipe,
    LabelPipe,
    NodesPipe,
    ParamsPipe,
    TimesincePipe,
  ]
})
export class AppPipesModule { }
