import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContextMenuTriggerDirective } from './context-menu-trigger.directive';


@NgModule({
  declarations: [
    ContextMenuTriggerDirective,
  ],
  exports: [
    ContextMenuTriggerDirective
  ],
  imports: [
    CommonModule
  ]
})
export class AppDirectivesModule { }
