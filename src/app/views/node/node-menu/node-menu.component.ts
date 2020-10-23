import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Node } from '../../../components/node/node';

import { ActivityAnimationService } from '../../../services/activity/activity-animation.service';
import { ActivityChartService } from '../../../services/activity/activity-chart.service';


@Component({
  selector: 'app-node-menu',
  templateUrl: './node-menu.component.html',
  styleUrls: ['./node-menu.component.scss']
})
export class NodeMenuComponent implements OnInit {
  @Input() disabled = false;
  @Input() node: Node;

  constructor(
    private _activityAnimationService: ActivityAnimationService,
    private _activityChartService: ActivityChartService,
  ) { }

  ngOnInit() {
  }

  selectColor(color: string): void {
    this.node.view.color = color;
    this._activityAnimationService.update.emit();
    this._activityChartService.update.emit();
  }

}
