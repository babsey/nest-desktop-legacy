import { Component, OnInit, OnDestroy, Input, HostListener } from '@angular/core';

import * as d3 from 'd3';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import * as STATS from 'stats.js';

import { ActivityAnimationGraph } from '../../../../components/activity/Threejs/activityAnimationGraph';
import { ScatterAnimation } from '../../../../components/activity/Threejs/scatterAnimation';

import { ActivityGraphService } from '../../../../services/activity/activity-graph.service';



@Component({
  selector: 'app-three-scatter',
  templateUrl: './three-scatter.component.html',
  styleUrls: ['./three-scatter.component.scss']
})
export class ThreeScatterComponent implements OnInit, OnDestroy {
  @Input() graph: ActivityAnimationGraph;
  // @Input() config: any = {};
  private _scene: ScatterAnimation;
  private _subscriptionInit: any;
  private _subscriptionUpdate: any;

  constructor(
    private _activityGraphService: ActivityGraphService,
  ) { }

  ngOnInit() {
    console.log('Ng init Three scatter')
    this._subscriptionUpdate = this._activityGraphService.update.subscribe(() => this.update());
    this.init();
  }

  ngOnDestroy() {
    console.log('Ng destroy Three scatter');
    this.clear();
    this._subscriptionUpdate.unsubscribe();
  }

  init() {
    console.log('Init Three scatter');
    this.clear();
    setTimeout(() => {
      this._scene = new ScatterAnimation(this.graph, 'activityAnimationContainer');
    }, 100);
  }

  clear() {
    console.log('Clear Three scatter');
    if (this._scene) {
      this._scene.stop();
      this._scene.clear();
    }
  }

  update() {
    console.log('Update Three scatter');
    this._scene.frameUpdate();
  }

  @HostListener('window:resize', [])
  resize(): void {
    if (this._scene) {
      this._scene.resize();
    }
  }

}
