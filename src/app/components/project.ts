import * as objectHash from 'object-hash';
import { environment } from '../../environments/environment';

import { App } from './app';
import { Model } from './model';
import { Network } from './network';
import { Node } from './node';
import { ProjectCode } from './projectCode';
import { Simulation } from './simulation';
import { Activity } from './activity';


export class Project {
  app: App;                             // parent

  // Database instances
  _id: string;                          // id of the database
  createdAt: string;                    // when it is created in database
  updatedAt: string;                    // when it is updated in database

  // Project instance variables
  name: string;                         // project name
  description: string;                  // description about the project
  hash: string;                         // hash of serialized network
  // user: string;                      // obsolete?
  // group: string;                     // obsolete?

  // Project objects
  network: Network;                     // network of neurons and devices
  simulation: Simulation;               // settings for the simulation
  code: ProjectCode;                    // code script for the simulation

  constructor(
    app: App,
    project: any = {},
  ) {
    // console.log(project)
    this.app = app;
    this.code = new ProjectCode(this);

    this._id = project._id;
    this.createdAt = project.createdAt;
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

  }

  get id(): string {
    return this._id;
  }

  get activities(): Activity[] {
    const recorders: Node[] = this.network.nodes.filter(node => (node.model.elementType === 'recorder' && node.activity !== undefined));
    return recorders.map(recorder => recorder.activity);
  }

  initNetwork(network: any = {}): void {
    this.network = new Network(this, network);
  }

  initSimulation(simulation: any = {}): void {
    this.simulation = new Simulation(this, simulation);
  }

  updateActivities(data: any): void {
    // console.log('Update activities')
    this.simulation.kernel['time'] = data.kernel['time'];
    // Update recorded activity
    data['activities'].forEach((activity, idx) => {
      const recNode: Node = this.network.recorders[idx];
      recNode.updateActivity(activity);
    })
  }

  hasActivities(): boolean {
    return this.activities.length > 0;
  }

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

  upgradeSimulation(project: any): any {
    const simulation: any = {
      time: project.simulation.time,
      randomSeed: project.simulation.random_seed,
      kernel: project.simulation.kernel,
    };
    return simulation;
  }

  upgradeNetwork(project: any): any {
    const network: any = {
      nodes: [],
      connections: [],
    }
    if (Object.keys(project).length == 0) return network

    project.app.nodes.forEach(appNode => {
      const simNode: any = project.simulation.collections[appNode.idx];
      const simModel: any = project.simulation.models[simNode.model];
      const appModel: any = project.app.models[simNode.model];
      const params: any[] = Object.entries(simModel.params).map(p => {
        return {
          id: p[0],
          value: p[1],
          visible: appModel ? appModel.display.includes(p[0]) : false,
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
          .filter(spec => spec[0] != 'rule')
          .map(param => { return { id: param[0], value: param[1] } })
      }
      const synapse: any = {
        params: [],
      };
      const synModel: Model = this.app.getModel(synapse.model || 'static_synapse');
      if (simLink.hasOwnProperty('syn_spec')) {
        synModel.params.forEach(modelParam => {
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

  save(): any {
    return this.app.saveProject(this).then(() => this.app.initProjects());
  }

  clone(): Project {
    return new Project(this.app, this);
  }

  clean(): void {
    this.hash = objectHash(this.serialize('simulator'));
  }

  download(): void {
    this.app.downloadProject(this.serialize('file'));
  }

  serialize(to: string): any {
    const project: any = {
      network: this.network.serialize(to),
      simulation: this.simulation.serialize(to),
    };
    if (to === 'db' || to === 'file') {
      project['createdAt'] = this.createdAt;
      project['updatedAt'] = this.updatedAt;

      project['name'] = this.name;
      project['description'] = this.description;
      project['hash'] = this.hash;
      project['version'] = this.app.version;
    }
    if (to === 'db') {
      project['_id'] = this.id;
    }
    return project;
  }

}
