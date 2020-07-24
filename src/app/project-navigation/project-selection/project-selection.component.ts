import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Project } from '../../components/project';


@Component({
  selector: 'app-project-selection',
  templateUrl: './project-selection.component.html',
  styleUrls: ['./project-selection.component.scss']
})
export class ProjectSelectionComponent implements OnInit {
  @Input() projects: Project[];
  @Output() select: EventEmitter<any> = new EventEmitter();
  public selected: Project[];

  constructor(
  ) {
  }

  ngOnInit() {
    // console.log('Simulation selection')
  }

  selectionSubmit(mode: string): void {
    this.select.emit({ mode: mode, selected: this.selected })
  }
}
