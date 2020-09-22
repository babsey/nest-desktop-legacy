import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { enterAnimation } from '../../animations/enter-animation';

import { Project } from '../../components/project/project';

import { AppService } from '../../services/app/app.service';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  animations: [enterAnimation],
})
export class ProjectComponent implements OnInit {
  private _projectId = '';
  private _projectRev = '';

  constructor(
    private _appService: AppService,
    private _route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this._route.params.subscribe((params: any) => { this._projectId = params.id; });
    this._route.params.subscribe((params: any) => { this._projectRev = params.rev; });
  }

  get projectId(): string {
    return this._projectId;
  }

  get projectRev(): string {
    return this._projectRev;
  }

}
