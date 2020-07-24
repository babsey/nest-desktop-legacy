import { Component, OnInit, Input, ViewChild, ElementRef, HostListener } from '@angular/core';

import { Project } from '../../components/project';
import { Node } from '../../components/node';


@Component({
  selector: 'app-project-sidenav-content',
  templateUrl: './project-sidenav-content.component.html',
  styleUrls: ['./project-sidenav-content.component.scss']
})
export class ProjectSidenavContentComponent implements OnInit {
  @Input() project: Project;
  @Input() mode: string;
  @ViewChild('content', { static: false }) content: ElementRef;
  public width: number = 12;
  public height: number = 12;

  constructor() { }

  ngOnInit() {
    setTimeout(() => this.triggerResize(), 10)
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
