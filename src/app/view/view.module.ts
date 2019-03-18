import { NgModule } from '@angular/core';
import { AppFormsModule } from '../forms/forms.module';
import { AppPipesModule } from '../pipes/pipes.module';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../modules/material.module';

import { NodesViewComponent } from './nodes-view/nodes-view.component';
import { LinksViewComponent } from './links-view/links-view.component';
import { TreeViewComponent } from './tree-view/tree-view.component';

import { MccColorPickerModule } from 'material-community-components';

@NgModule({
  declarations: [
    NodesViewComponent,
    LinksViewComponent,
    TreeViewComponent,
  ],
  exports: [
    NodesViewComponent,
    LinksViewComponent,
    TreeViewComponent,
  ],
  imports: [
    AppFormsModule,
    AppPipesModule,
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    MaterialModule,
    MccColorPickerModule.forRoot({
      used_colors: []
    }),
  ]
})
export class ViewModule { }
