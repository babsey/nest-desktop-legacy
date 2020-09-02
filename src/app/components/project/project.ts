import * as objectHash from 'object-hash';
import { environment } from '../../../environments/environment';
import { v4 as uuidv4 } from 'uuid';

import { Activity } from '../activity/activity';
import { App } from '../app';
import { Config } from '../config';
import { Model } from '../model/model';
import { Network } from '../network/network';
import { Node } from '../node/node';
import { ProjectCode } from './projectCode';
import { Simulation } from '../simulation/simulation';


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
  network: Network;                     // network of neurons and devices
  simulation: Simulation;               // settings for the simulation
  code: ProjectCode;                    // code script for NEST Server

  private _networkRevisions: any[] = [];         // network history
  private _networkRevisionIdx: number = -1;      // Index of the network history;

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

    const projectUpgraded: any = this.backwardCompatible(project);
    this.initNetwork(projectUpgraded['network'])
    this.initSimulation(projectUpgraded['simulation']);

    this.clean();
    this.code = new ProjectCode(this);
  }

  get id(): string {
    return this._id;
  }

  get rev(): string {
    return this._rev;
  }

  // Make the old projects compatible.
  backwardCompatible(project: any): any {
    if (Object.keys(project).length === 0) {
      return {};
    }

    let valid: boolean = false;       // only true when version is 2.5 or newer
    if (project.hasOwnProperty('version')) {
      const version: string[] = project.version.split('.');
      valid = (Number(version[0]) === 2 && Number(version[1]) >= 5) || Number(version[0]) > 2;
    }

    const projectUpgraded: any = {
      network: valid ? project.network : this.upgradeNetwork(project),
      simulation: valid ? project.simulation : this.upgradeSimulation(project),
    }
    return projectUpgraded;
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

  // Load revisions of the current project from the database.
  revisions(): Promise<any> {
    return this.app.projectDB.revisions(this.id);
  }

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

  // Make network compatible
  upgradeNetwork(project: any): any {
    const network: any = {
      nodes: [],
      connections: [],
    }
    if (Object.keys(project).length === 0) return network

    project.app.nodes.forEach(appNode => {
      const simNode: any = project.simulation.collections[appNode.idx];
      const simModel: any = project.simulation.models[simNode.model];
      const appModel: any = project.app.models[simNode.model];
      const params: any[] = Object.entries(simModel.params).map((param: any[]) => {
        return {
          id: param[0],
          value: param[1],
          visible: appModel ? appModel.display.includes(param[0]) : false,
        }
      });
      const view: any = {
        elementType: simNode.element_type,
        color: appNode.color,
        position: appNode.position,
      }
      const node: any = {
        idx: appNode.idx,
        params: params,
        size: simNode.n || 1,
        model: typeof simModel === 'string' ? simModel : simModel.existing,
        view: view,
      };
      if (simNode.hasOwnProperty('spatial')) {
        node['spatial'] = simNode.spatial;
        if (node.spatial.hasOwnProperty('rows')) {
          node.spatial['shape'] = [node.spatial.rows, node.spatial.columns];
        }
        if (node.spatial.hasOwnProperty('positions')) {
          node.spatial['pos'] = node.spatial.positions;
        }
      }
      network.nodes.push(node);
    })

    // Object.entries(project.simulation.models).map(item => {
    //   const model: any = this.copy(item[1]);
    //   model['id'] = item[0];
    //   model['params'] = Object.entries(model.params).map(p => {
    //     return {
    //       id: p[0],
    //       value: p[1],
    //     }
    //   })
    //   network.models.push(model)
    // })

    project.simulation.connectomes.forEach(simLink => {
      const connection: any = {
        source: simLink.source,
        target: simLink.target,
      }
      if (simLink.hasOwnProperty('conn_spec')) {
        connection['rule'] = simLink.conn_spec.rule || 'all_to_all';
        connection['params'] = Object.entries(simLink.conn_spec)
          .filter((spec: any[]) => spec[0] != 'rule')
          .map((param: any[]) => { return { id: param[0], value: param[1] } })
      }
      const synapse: any = {
        params: [],
      };
      const synModel: Model = this.app.getModel(synapse.model || 'static_synapse');
      if (simLink.hasOwnProperty('syn_spec')) {
        synModel.params.forEach((modelParam: any) => {
          const simParam: any = simLink.syn_spec[modelParam.id];
          const param: any = {
            id: modelParam.id,
            value: simParam !== undefined ? simParam : modelParam.value,
            visible: simParam !== undefined,
          };
          synapse.params.push(param);
        })
      }
      connection['synapse'] = synapse;
      network.connections.push(connection);
    })

    return network
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
  }

  // Load network from the history list.
  checkoutNetwork(): void {
    if (this._networkRevisionIdx >= this._networkRevisions.length) {
      this._networkRevisionIdx = this._networkRevisions.length - 1;
    }
    const network: any = this._networkRevisions[this._networkRevisionIdx];
    this.network = new Network(this, network);
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

  // Make simulation compatible.
  upgradeSimulation(project: any): any {
    const simulation: any = {
      time: project.simulation.time,
      randomSeed: project.simulation.random_seed,
      kernel: project.simulation.kernel,
    };
    return simulation;
  }

  /*
  Activities
  */

  // Get a list of activities.
  get activities(): Activity[] {
    return this.network ? this.network.recorders.map((recorder: Node) => recorder.activity) : [];
  }

  // Update activities in recorder nodes after simulation.
  updateActivities(data: any): void {
    // console.log('Update activities')
    this.simulation.kernel['time'] = data.kernel['time'];
    // Update recorded activity
    data['activities'].forEach((activity: any, idx: number) => {
      this.activities[idx].update(activity);
    })
  }

  // Check if the project has activities.
  hasActivities(): boolean {
    return this.activities.length > 0 ? this.activities.some((activity: Activity) => activity.hasEvents()) : false;
  }

  // Check if the project has activities.
  hasSpatialActivities(): boolean {
    return this.activities.length > 0 ? this.activities.some((activity: Activity) => activity.hasEvents() && activity.nodePositions.length > 0) : false;
  }

  /*
  Serialization
  */

  // Update hash of this project.
  clean(): void {
    this.hash = objectHash(this.toJSON('simulator'));
  }

  // Is the hash equal to caluclated hash.
  isHashEqual(): boolean {
    return this.hash === objectHash(this.toJSON('simulator'));
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
