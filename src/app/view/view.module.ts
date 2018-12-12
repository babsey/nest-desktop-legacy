import { NgModule } from '@angular/core';
import { AppFormsModule } from '../forms/forms.module';
import { AppPipesModule } from '../pipes/pipes.module';
import { AppRoutingModule } from '../modules/app-routing.module';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../modules/material.module';
import { SketchModule } from '../sketch/sketch.module';

import { NetworkViewComponent } from './network-view/network-view.component';
import { NodesViewComponent } from './nodes-view/nodes-view.component';
import { LinksViewComponent } from './links-view/links-view.component';
import { TreeViewComponent } from './tree-view/tree-view.component';
import { ViewComponent } from './view.component';

@NgModule({
  imports: [
    AppFormsModule,
    AppPipesModule,
    AppRoutingModule,
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    MaterialModule,
    SketchModule,
  ],
  declarations: [
    NetworkViewComponent,
    NodesViewComponent,
    LinksViewComponent,
    TreeViewComponent,
    ViewComponent,
  ],
  exports: [
    NetworkViewComponent,
    NodesViewComponent,
    LinksViewComponent,
    TreeViewComponent,
  ]
})
export class ViewModule { }
