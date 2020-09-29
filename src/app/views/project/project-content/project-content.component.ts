import { Component, OnInit, Input, ViewChild, ElementRef, HostListener } from '@angular/core';

import { Node } from '../../../components/node/node';
import { Project } from '../../../components/project/project';


@Component({
  selector: 'app-project-content',
  templateUrl: './project-content.component.html',
  styleUrls: ['./project-content.component.scss']
})
export class ProjectContentComponent implements OnInit {
  @Input() project: Project;
  @ViewChild('content', { static: false }) content: ElementRef;
  private _height = 12;
  private _width = 12;

  constructor() {
  }

  ngOnInit() {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 10);
  }

  get height(): number {
    return this._height;
  }

  get view(): any {
    return this.project.app.view.project;
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
