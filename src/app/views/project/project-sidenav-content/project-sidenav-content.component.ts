import { Component, OnInit, Input, ViewChild, ElementRef, HostListener } from '@angular/core';

import { Node } from '../../../components/node/node';
import { Project } from '../../../components/project/project';

import { ProjectService } from '../../../services/project/project.service';


@Component({
  selector: 'app-project-sidenav-content',
  templateUrl: './project-sidenav-content.component.html',
  styleUrls: ['./project-sidenav-content.component.scss']
})
export class ProjectSidenavContentComponent implements OnInit {
  @Input() project: Project;
  @ViewChild('content', { static: false }) content: ElementRef;
  private _height = 12;
  private _width = 12;

  constructor(
    private _projectService: ProjectService,
  ) { }

  ngOnInit() {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 10);
  }

  get height(): number {
    return this._height;
  }

  get mode(): string {
    return this._projectService.mode;
  }

  get width(): number {
    return this._width;
  }

  @HostListener('window:resize', [])
  resize(): void {
    if (this.content === undefined) { return; }
    const element: any = this.content.nativeElement;
    this._width = element.clientWidth;
    this._height = element.clientHeight;
  }

}
