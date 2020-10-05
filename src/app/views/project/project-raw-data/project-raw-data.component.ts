import { Component, OnInit, Input } from '@angular/core';

import { Project } from '../../../components/project/project';


@Component({
  selector: 'app-project-raw-data',
  templateUrl: './project-raw-data.component.html',
  styleUrls: ['./project-raw-data.component.scss']
})
export class ProjectRawDataComponent implements OnInit {
  @Input() project: Project;
  private _options: any;

  constructor() {
    this._options = {
      cursorBlinkRate: 700,
      foldGutter: true,
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
      lineNumbers: true,
      lineWrapping: true,
      readOnly: true,
      mode: { name: 'javascript', json: true }
    };
  }

  ngOnInit() {
  }

  get content(): string {
    return JSON.stringify(this.project, null, '\t');
  }

  get options(): any {
    return this._options;
  }

}
