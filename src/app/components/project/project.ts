import * as objectHash from 'object-hash';
import { environment } from '../../../environments/environment';

import { Activity } from '../activity/activity';
import { App } from '../app';
import { Model } from '../model/model';
import { Network } from '../network/network';
import { Node } from '../node/node';
import { ProjectCode } from './projectCode';
import { Simulation } from '../simulation/simulation';


export class Project {
  app: App;                             // parent

  // Database instances
  _id: string;                          // id of the database
  createdAt: string;                    // when it is created in database
  updatedAt: string;                    // when it is updated in database

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

  constructor(
    app: App,
    project: any = {},
  ) {
    // console.log(project)
    this.app = app;

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
    this.code = new ProjectCode(this);
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

  isSelected(): boolean {
    return this._id === this.app.project._id;
  }

  save(): Promise<any> {
    return this.app.saveProject(this);
  }

  clone(): Project {
    return new Project(this.app, this.serialize('db'));
  }

  duplicate(): void {
    const newProject: Project = this.clone();
    newProject._id = '';
    this.app.saveProject(newProject).then(doc => {
      newProject._id = doc.id;
      newProject.updatedAt = JSON.stringify(new Date());
      this.app.projects.unshift(newProject);
    });
  }

  clean(): void {
    this.hash = objectHash(this.serialize('simulator'));
  }

  delete(): void {
    this.app.deleteProject(this.id);
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
      project['_id'] = this.id;                 // Question: When you give your project to someone, is it necessary, that ids of the same project are identical.
    }
    return project;
  }

}
