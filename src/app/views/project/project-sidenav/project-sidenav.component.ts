import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Network } from '../../../components/network/network';
import { Project } from '../../../components/project/project';


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
