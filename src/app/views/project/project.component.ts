import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { enterAnimation } from '../../animations/enter-animation';

import { Project } from '../../components/project/project';

import { AppService } from '../../services/app/app.service';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  animations: [enterAnimation],
})
export class ProjectComponent implements OnInit, OnDestroy {
  public projectId: string = '';

  constructor(
    public _appService: AppService,
    private bottomSheet: MatBottomSheet,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => this.projectId = params['id']);
  }

  ngOnDestroy() {
    this.bottomSheet.dismiss();
  }

}
