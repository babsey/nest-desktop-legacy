import { Component, OnInit, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import CodeMirror from 'codemirror';

import { Project } from '../../../../components/project/project';
import { ActivityChartGraph } from '../../../../components/activity/activityChartGraph';
import { ActivityGraphPanel } from '../../../../components/activity/plotPanels/activityGraphPanel';
import { SpikeTimesHistogramPanel } from '../../../../components/activity/plotPanels/spikeTimesHistogramPanel';

import { ActivityChartService } from '../../../../services/activity/activity-chart.service';


@Component({
  selector: 'app-activity-chart-controller',
  templateUrl: './activity-chart-controller.component.html',
  styleUrls: ['./activity-chart-controller.component.scss']
})
export class ActivityChartControllerComponent implements OnInit {
  @Input() project: Project;
  private _options: any = {
    cursorBlinkRate: 700,
    foldGutter: true,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    hintOptions: {
      completeSingle: false,
      hintWords: []
    },
    lineNumbers: true,
    lineWrapping: true,
    mode: 'python',
    styleActiveLine: true,
    extraKeys: {
      "Ctrl-Space": "autocomplete",
    }
  };
  private _selectedPanel: ActivityGraphPanel;

  constructor(
    private _activityChartService: ActivityChartService,
  ) { }

  ngOnInit() {
  }

  get code(): string {
    return JSON.stringify(this.graph.data, null, 2);
  }

  get graph(): ActivityChartGraph {
    return this.project.activityGraph;
  }

  get options(): any {
    return this._options;
  }

  get panelsVisible(): string[] {
    return this.graph.panelsVisible;
  }

  set panelsVisible(value: string[]) {
    // console.log('Set visible panels for', this.project.name, value);
    this.graph.panelsVisible = value;
  }

  get selectedPanel(): ActivityGraphPanel {
    return this._activityChartService.selectedPanel;
  }

  selectPanel(panelId: string): void {
    this._activityChartService.selectedPanel = this.graph.panelsAll.find((panel: any) => panel.id === panelId);
  }

  movePanel(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.graph.panelsAll, event.previousIndex, event.currentIndex);
    this._activityChartService.update.emit();
  }

  removePanel(panelId: string) {
    this.graph.panelsVisible = this.graph.panelsVisible.filter((id: string) => id !== panelId);
    this.graph.update();
  }

  addPanel(panelId: string) {
    this.graph.panelsVisible.push(panelId);
    this.graph.panelsVisible = this.graph.panelsVisible;
    this.graph.update();
  }

  onChange(value: number): void {
    setTimeout(() => this.selectedPanel.update(), 100);
  }

}
