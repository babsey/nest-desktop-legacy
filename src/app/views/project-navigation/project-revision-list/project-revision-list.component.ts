import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';

import { listAnimation } from '../../../animations/list-animation';

import { App } from '../../../components/app';
import { Project } from '../../../components/project/project';



@Component({
  selector: 'app-project-revision-list',
  templateUrl: './project-revision-list.component.html',
  styleUrls: ['./project-revision-list.component.scss'],
  animations: [listAnimation],
})
export class ProjectRevisionListComponent implements OnInit {
  @Input() app: App;

  constructor(
    private _router: Router,
  ) { }

  ngOnInit() {
    // console.log('Ng init project list');
  }

  navigate(id: string, rev): void {
    const url = `project/${id}/${rev}`;
    this._router.navigate([{ outlets: { primary: url, nav: 'project' } }]);
  }

}
