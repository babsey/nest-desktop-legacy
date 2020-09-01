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
  public width: number = 12;
  public height: number = 12;

  constructor(
    private _projectService: ProjectService,
  ) { }

  ngOnInit() {
    setTimeout(() => this.triggerResize(), 10)
  }

  get mode(): string {
    return this._projectService.mode;
  }

  triggerResize(): void {
    window.dispatchEvent(new Event('resize'));
  }

  @HostListener('window:resize', [])
  resize(): void {
    if (this.content === undefined) return
    const element: any = this.content.nativeElement;
    this.width = element.clientWidth;
    this.height = element.clientHeight;
  }

}
