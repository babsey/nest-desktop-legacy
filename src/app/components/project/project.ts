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
import { ProjectView } from './projectView';
import { Simulation } from '../simulation/simulation';
import { upgradeProject } from './projectUpgrade';



export class Project extends Config {
  private _app: App;                             // parent
  private _view: ProjectView;

  // Database instances
  private _id: string;                  // id of the project
  private _rev: string;                 // rev of the project
  private _createdAt: string;                    // when is it created in database
  private _updatedAt: string;                    // when is it updated in database

  // Project instance variables
  private _name: string;                         // project name
  private _description: string;                  // description about the project
  private _hash: string;                         // obsolete: hash of serialized network

  // user: string;                      // obsolete?
  // group: string;                     // obsolete?

  // Project objects
  private _network: Network;                     // network of neurons and devices
  private _simulation: Simulation;               // settings for the simulation
  private _code: ProjectCode;                    // code script for NEST Server
  private _activityGraph: ActivityChartGraph;

  private _networkRevisions: any[] = [];         // network history
  private _networkRevisionIdx = -1;      // Index of the network history;

  private _hasActivities = false;
  private _hasSpatialActivities = false;

  constructor(
    app: App,
    project: any = {},
  ) {
    super('Project');
    this._app = app;
    this._view = new ProjectView(this);

    this._id = project._id || uuidv4();
    this._rev = project._rev || '';
    this._createdAt = project.createdAt || new Date();
    this._updatedAt = project.updatedAt;

    this._name = project.name || '';
    this._description = project.description || '';
    this._hash = project.hash || '';
    // this.user = project.user || '';
    // this.group = project.group || '';

    const projectUpgraded: any = upgradeProject(this._app, project);
    this.initSimulation(projectUpgraded.simulation);
    this.initNetwork(projectUpgraded.network);

    this.clean();
    this._code = new ProjectCode(this);
    this.initActivityGraph();
  }

  get activityGraph(): ActivityChartGraph {
    return this._activityGraph;
  }

  get app(): App {
    return this._app;
  }

  get code(): ProjectCode {
    return this._code;
  }

  get createdAt(): string {
    return this._createdAt;
  }

  set createdAt(value: string) {
    this._createdAt = value;
  }

  get description(): string {
    return this._description;
  }

  get hash(): string {
    return this._hash;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get network(): Network {
    return this._network;
  }

  get rev(): string {
    return this._rev;
  }

  get simulation(): Simulation {
    return this._simulation;
  }

  get updatedAt(): string {
    return this._updatedAt;
  }

  set updatedAt(value: string) {
    this._updatedAt = value;
  }

  get view(): ProjectView {
    return this._view;
  }

  // Is the current project selected?
  isSelected(): boolean {
    return this._id === this._app.project.id;
  }

  // Save the current project.
  save(): Promise<any> {
    return this._app.saveProject(this);
  }

  // Clone a new project of this current project.
  clone(): Project {
    const newProject = new Project(this._app, this.toJSON());
    newProject._id = uuidv4();
    newProject._updatedAt = '';
    return newProject;
  }

  // Clone this current project and add it to the list.
  duplicate(): Project {
    const newProject: Project = this.clone();
    this._app.projects.unshift(newProject);
    return newProject;
  }

  // Delete this current project from the list and database.
  delete(): void {
    this._app.deleteProject(this._id);
  }

  // Download this current project.
  download(): void {
    this._app.downloadProject(this.toJSON('file'));
  }

  // Reload this current project.
  reload(): Promise<any> {
    return this._app.reloadProject(this);
  }

  /*
  Project revisions
  */

  // Is the current revised project selected?
  isRevisionSelected(): boolean {
    return this._rev === this._app.project.rev;
  }

  /*
  Networks
  */

  // Initialize a network.
  initNetwork(network: any = {}): void {
    this.clearNetworkHistory();
    this._network = new Network(this, network);
    this.commitNetwork(this._network);
  }

  // Get revision index of the network history.
  get networkRevisionIdx(): number {
    return this._networkRevisionIdx;
  }

  // Get list of network history.
  get networkRevisions(): any[] {
    return this._networkRevisions;
  }

  isNetworkChanged(): boolean {
    return this.getHash() !== this._activityGraph.hash && !this._simulation.running;
  }

  // Clear network history list.
  clearNetworkHistory(): void {
    this._networkRevisions = [];
    this._networkRevisionIdx = -1;
  }

  // Add network to the history list.
  commitNetwork(network: Network): void {
    // console.log('Commit network');
    const maxRev: number = this.config.maxNetworkRevisions || 5;
    this._networkRevisions = this._networkRevisions.slice(0, this._networkRevisionIdx + 1);
    if (this._networkRevisions.length > maxRev) {
      this._networkRevisions = this._networkRevisions.slice(this._networkRevisions.length - maxRev);
    }
    this._networkRevisions.push(network.toJSON());
    this._networkRevisionIdx = this._networkRevisions.length - 1;
  }

  // Load network from the history list.
  checkoutNetwork(): void {
    // console.log('Checkout network');
    if (this._networkRevisionIdx >= this._networkRevisions.length) {
      this._networkRevisionIdx = this._networkRevisions.length - 1;
    }
    const network: any = this._networkRevisions[this._networkRevisionIdx];

    const oldModels: string[] = this._network.recorders.map((node: Node) => node.modelId);
    this._network.update(network);
    const newModels: string[] = this._network.recorders.map((node: Node) => node.modelId);

    if (objectHash(JSON.stringify(oldModels)) === objectHash(JSON.stringify(newModels))) {
      this._activityGraph.initPanels();
    } else {
      this._activityGraph.init();
    }
    if (this.config.runAfterCheckout) {
      setTimeout(() => this.runSimulationScript(), 1);
    }
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
    this._simulation = new Simulation(this, simulation);
  }

  simulateAfterChange(): void {
    const viewActivityExplorer: boolean = this._app.view.project.mode === 'activityExplorer';
    if (viewActivityExplorer && this.config.runAfterChange) {
      setTimeout(() => this.runSimulation(), 1);
    }
  }

  runSimulation(): Promise<any> {
    // console.log('Run simulation');
    const viewCodeEditor: boolean = this.app.view.project.sidenavMode === 'codeEditor';
    const runScript: boolean = this.app.nestServer.state.simulatorVersion.startsWith('2.');
    return (!runScript || viewCodeEditor) ?
      this.runSimulationCode() : this.runSimulationScript();
  }

  runSimulationScript(): Promise<any> {
    // console.log('Run simulation script');
    if (this.simulation.config.autoRandomSeed) {
      const seed: number = Math.random() * 1000;
      this.simulation.randomSeed = parseInt(seed.toFixed(0), 0);
    }
    this.code.generate();

    this._simulation.running = true;
    const url: string = this._app.nestServer.url + '/script/simulation/run';
    const data: any = this.toJSON('simulator');
    return this._app.nestServer.http.post(url, data)
      .then((resp: any) => {
        this._simulation.running = false;
        this.updateActivities(resp.data);
        return resp;
      }).catch((err: any) => {
        this._simulation.running = false;
        return err;
      });
  }

  runSimulationCode(): Promise<any> {
    // console.log('Run simulation code');
    this._simulation.running = true;
    const url: string = this._app.nestServer.url + '/exec';
    const data: any = {
      source: this._code.script,
      return: 'response'
    };
    return this.app.nestServer.http.post(url, data)
      .then((resp: any) => {
        this._simulation.running = false;
        this.updateActivities(resp.data);
        return resp;
      }).catch((err: any) => {
        this._simulation.running = false;
        return err;
      });
  }

  /*
  Activities
  */

  // Get a list of activities.
  get activities(): Activity[] {
    // console.log('Get activities')
    return this._network ? this._network.recorders.map((recorder: Node) => recorder.activity) : [];
  }

  // Check if the project has activities.
  get hasActivities(): boolean {
    return this._hasActivities;
  }

  // Check if the project has spatial activities.
  get hasSpatialActivities(): boolean {
    return this._hasSpatialActivities;
  }

  initActivityGraph(panels: any[] = []): void {
    this._activityGraph = new ActivityChartGraph(this, panels);
  }

  // Update activities in recorder nodes after simulation.
  updateActivities(data: any): void {
    // console.log('Update activities');
    this._simulation.kernel.time = data.kernel.time;
    // Update recorded activity
    const activities: Activity[] = this.activities;
    data.activities.forEach((activity: any, idx: number) => {
      activities[idx].update(activity, idx);
    });
    this.checkActivities();
    this._activityGraph.update();
  }

  checkActivities(): void {
    const activities: Activity[] = this.activities;
    this._hasActivities = activities.length > 0 ? activities.some(
      (activity: Activity) => activity.hasEvents()) : false;
    this._hasSpatialActivities = this.hasActivities ? activities.some(
      (activity: Activity) => activity.hasEvents() && activity.nodePositions.length > 0) : false;
  }

  /*
  Serialization
  */

  // Update hash of this project.
  clean(): void {
    this._hash = this.getHash();
  }

  // Is the hash equal to caluclated hash.
  isHashEqual(): boolean {
    return this._hash === this.getHash();
  }

  getHash(): string {
    return objectHash(this.toJSON('simulator'));
  }

  // Serialize this project for database or simulator.
  toJSON(target: string = 'db'): any {
    // this.hash = objectHash(this.network.toJSON('simulator'));
    const project: any = {
      name: this._name,
      network: this._network.toJSON(target),
      simulation: this._simulation.toJSON(target),
    };
    if (target === 'db') {
      const meta: any = {
        _id: this._id,
        createdAt: this._createdAt,
        description: this._description,
        hash: this._hash,
        updatedAt: this._updatedAt,
        version: this._app.version,
      };
      return { ...project, ...meta };
    } else {
      return project;
    }
  }

}
