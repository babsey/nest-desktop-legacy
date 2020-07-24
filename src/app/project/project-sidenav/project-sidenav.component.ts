import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Project } from '../../components/project';
import { Network } from '../../components/network';


@Component({
  selector: 'app-project-sidenav',
  templateUrl: './project-sidenav.component.html',
  styleUrls: ['./project-sidenav.component.scss']
})
export class ProjectSidenavComponent implements OnInit {
  @Input() project: Project;
  @Input() mode: string;

  constructor() { }

  ngOnInit() {
  }

}
