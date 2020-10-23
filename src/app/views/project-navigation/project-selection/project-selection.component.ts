import { Component, OnInit, Input } from '@angular/core';

import { App } from '../../../components/app';
import { Project } from '../../../components/project/project';


@Component({
  selector: 'app-project-selection',
  templateUrl: './project-selection.component.html',
  styleUrls: ['./project-selection.component.scss']
})
export class ProjectSelectionComponent implements OnInit {
  @Input() app: App;
  private _selected: string[];              // Project ids

  constructor() {
  }

  ngOnInit() {
    // console.log('Ng init project selection')
  }

  get selected(): string[] {
    return this._selected;
  }

  set selected(value: string[]) {
    this._selected = value;
  }

  delete(): void {
    this.app.deleteProjects(this.selected);
    this.selected = [];
  }

  download(): void {
    this.app.downloadProjects(this.selected);
  }

}
