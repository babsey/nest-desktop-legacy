import * as objectHash from 'object-hash';
import { environment } from '../../../environments/environment';
import { v4 as uuidv4 } from 'uuid';

import { Activity } from '../activity/activity';
import { ActivityChartGraph } from '../activity/activityChartGraph';
import { App } from '../app';
import { Config } from '../config';
import { Model } from '../model/model';
import { Network } from '../network/network';
import { Node } from '../node/node';
import { ProjectCode } from './projectCode';
import { Simulation } from '../simulation/simulation';
import { upgradeProject } from './projectUpgrade';


export class Project extends Config {
  app: App;                             // parent

  // Database instances
  private _id: string;                  // id of the project
  private _rev: string;                 // rev of the project
  createdAt: string;                    // when is it created in database
  updatedAt: string;                    // when is it updated in database

  // Project instance variables
  name: string;                         // project name
  description: string;                  // description about the project
  hash: string;                         // obsolete: hash of serialized network

  // user: string;                      // obsolete?
  // group: string;                     // obsolete?

  // Project objects
  public network: Network;                     // network of neurons and devices
  public simulation: Simulation;               // settings for the simulation
  public code: ProjectCode;                    // code script for NEST Server
  public activityGraph: ActivityChartGraph;

  private _networkRevisions: any[] = [];         // network history
  private _networkRevisionIdx = -1;      // Index of the network history;

  private _hasActivities = false;
  private _hasSpatialActivities = false;

  constructor(
    app: App,
    project: any = {},
  ) {
    super('Project');
    this.app = app;

    this._id = project._id || uuidv4();
    this._rev = project._rev || '';
    this.createdAt = project.createdAt || new Date();
    this.updatedAt = project.updatedAt;

    this.name = project.name || '';
    this.description = project.description || '';
    this.hash = project.hash || '';
    // this.user = project.user || '';
    // this.group = project.group || '';

    const projectUpgraded: any = upgradeProject(this.app, project);
    this.initNetwork(projectUpgraded.network);
    this.initSimulation(projectUpgraded.simulation);

    this.clean();
    this.code = new ProjectCode(this);
    this.activityGraph = new ActivityChartGraph(this);
  }

  get id(): string {
    return this._id;
  }

  get rev(): string {
    return this._rev;
  }

  // Is the current project selected?
  isSelected(): boolean {
    return this.id === this.app.project.id;
  }

  // Save the current project.
  save(): Promise<any> {
    return this.app.saveProject(this);
  }

  // Clone a new project of this current project.
  clone(): Project {
    const newProject = new Project(this.app, this.toJSON());
    newProject._id = uuidv4();
    newProject.updatedAt = '';
    return newProject;
  }

  // Clone this current project and add it to the list.
  duplicate(): Project {
    const newProject: Project = this.clone();
    this.app.projects.unshift(newProject);
    return newProject;
  }

  // Delete this current project from the list and database.
  delete(): void {
    this.app.deleteProject(this.id);
  }

  // Download this current project.
  download(): void {
    this.app.downloadProject(this.toJSON('file'));
  }

  // Reload this current project.
  reload(): Promise<any> {
    return this.app.reloadProject(this);
  }

  /*
  Project revisions
  */

  // Is the current revised project selected?
  isRevisionSelected(): boolean {
    return this.rev === this.app.project.rev;
  }

  /*
  Networks
  */

  // Create a new network.
  initNetwork(network: any = {}): void {
    this.network = new Network(this, network);
    this.initNetworkHistory();
  }

  // Get revision index of the network history.
  get networkRevisionIdx(): number {
    return this._networkRevisionIdx;
  }

  // Get list of network history.
  get networkRevisions(): any[] {
    return this._networkRevisions;
  }

  // Clear network history and commit the current network.
  initNetworkHistory(): void {
    this.clearNetworkHistory();
    this.commitNetwork(this.network);
  }

  // Clear network history list.
  clearNetworkHistory(): void {
    this._networkRevisions = [];
    this._networkRevisionIdx = -1;
  }

  // Add network to the history list.
  commitNetwork(network: Network): void {
    this._networkRevisions = this._networkRevisions.slice(0, this._networkRevisionIdx + 1);
    this._networkRevisions.push(network.toJSON());
    this._networkRevisionIdx = this._networkRevisions.length - 1;
    this.updateActivityGraph();     // maybe it is critical point.
  }

  // Load network from the history list.
  checkoutNetwork(): void {
    if (this._networkRevisionIdx >= this._networkRevisions.length) {
      this._networkRevisionIdx = this._networkRevisions.length - 1;
    }
    const network: any = this._networkRevisions[this._networkRevisionIdx];
    this.network = new Network(this, network);
    this.updateActivityGraph();     // maybe it is critical point.
  }

  // Go to the older network.
  networkOlder(): void {
    if (this._networkRevisionIdx > 0) {
      this._networkRevisionIdx--;
    }
    this.checkoutNetwork();
  }

  // Go to the oldest network.
  networkOldest(): void {
    this._networkRevisionIdx = 0;
    this.checkoutNetwork();
  }

  // Go to the newer network.
  networkNewer(): void {
    if (this._networkRevisionIdx < this._networkRevisions.length) {
      this._networkRevisionIdx++;
    }
    this.checkoutNetwork();
  }

  // Go to the newest network.
  networkNewest(): void {
    this._networkRevisionIdx = this._networkRevisions.length - 1;
    this.checkoutNetwork();
  }

  /*
  Simulation
  */

  // Create a new simulation.
  initSimulation(simulation: any = {}): void {
    this.simulation = new Simulation(this, simulation);
  }

  /*
  Activities
  */

  // Get a list of activities.
  get activities(): Activity[] {
    // console.log('Get activities')
    return this.network ? this.network.recorders.map((recorder: Node) => recorder.activity) : [];
  }

  // Check if the project has activities.
  get hasActivities(): boolean {
    return this._hasActivities;
  }

  // Check if the project has spatial activities.
  get hasSpatialActivities(): boolean {
    return this._hasSpatialActivities;
  }

  updateActivityGraph(): void {
    if (this.activityGraph) {
      this.activityGraph.init();
      this.activityGraph.update();
    }
  }

  // Update activities in recorder nodes after simulation.
  updateActivities(data: any): void {
    // console.log('Update activities')
    this.simulation.kernel.time = data.kernel.time;
    // Update recorded activity
    data.activities.forEach((activity: any, idx: number) => {
      this.activities[idx].idx = idx;
      this.activities[idx].update(activity);
    });
    this.checkActivities();
    this.activityGraph.update();
  }

  checkActivities(): void {
    this._hasActivities = this.activities.length > 0 ? this.activities.some(
      (activity: Activity) => activity.hasEvents()) : false;
    this._hasSpatialActivities = this.hasActivities ? this.activities.some(
      (activity: Activity) => activity.hasEvents() && activity.nodePositions.length > 0) : false;
  }

  /*
  Serialization
  */

  // Update hash of this project.
  clean(): void {
    this.hash = this.getHash();
  }

  // Is the hash equal to caluclated hash.
  isHashEqual(): boolean {
    return this.hash === this.getHash();
  }

  getHash(): string {
    return objectHash(this.toJSON('simulator'));
  }

  // Serialize this project for database or simulator.
  toJSON(target: string = 'db'): any {
    // this.hash = objectHash(this.network.toJSON('simulator'));
    const project: any = {
      name: this.name,
      network: this.network.toJSON(target),
      simulation: this.simulation.toJSON(target),
    };
    if (target === 'db') {
      const meta: any = {
        _id: this.id,
        createdAt: this.createdAt,
        description: this.description,
        hash: this.hash,
        updatedAt: this.updatedAt,
        version: this.app.version,
      };
      return { ...project, ...meta };
    } else {
      return project;
    }
  }

}
