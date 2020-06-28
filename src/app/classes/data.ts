import * as objectHash from 'object-hash';

import { environment } from '../../environments/environment';


import { AppData } from './appData';
import { AppNode } from './appNode';
import { AppLink } from './appLink';
import { SimData } from './simData';
import { SimModel } from './simModel';


export class Data {
  _id: string;
  name: string;
  description: string;
  hash: string;
  user: string;
  group: string;
  createdAt: string;
  updatedAt: string;
  app: AppData;
  simulation: SimData;
  version?: string;

  constructor(
    data: any = {},
  ) {
    this._id = data._id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.hash = data.hash || '';
    this.user = data.user || '';
    this.group = data.group || '';
    this.createdAt = data.createdAt || '';
    this.updatedAt = data.updatedAt || '';
    this.app = new AppData(data.app);
    this.simulation = new SimData(data.simulation);
    this.clean()
  }

  toObject(): any {
    return JSON.parse(JSON.stringify(this))
  }

  clone(): Data {
    return new Data({
      name: this.name,
      description: this.description,
      user: this.user,
      group: this.group,
      app: this.app,
      simulation: this.simulation,
    })
  }

  createNode(elementType: string, point: number[]): void {
    var newName = elementType + '-' + this.label(this.simulation.collections.length);
    this.app.addModel(newName);
    this.app.addNode(point);
    this.simulation.addModel(newName, elementType);
    this.simulation.addCollection(newName, elementType);
    this.clean();
  }

  deleteNode(node: AppNode): void {
    this.app.nodes = this.app.nodes.filter((n, idx) => idx != node.idx);
    this.simulation.collections = this.simulation.collections.filter((n, idx) => idx != node.idx);
    this.app.nodes.forEach((n, idx) => n.idx = idx)

    var links = this.app.links.filter(link => {
      var connectome = this.simulation.connectomes[link.idx];
      return !(connectome.source == node.idx || connectome.target == node.idx);
    });
    links.forEach((link, idx) => link.idx = idx)
    this.app.links = links;
    var connectomes = this.simulation.connectomes.filter(connectome => connectome.source != node.idx && connectome.target != node.idx);
    connectomes.forEach(connectome => {
      connectome.source = connectome.source > node.idx ? connectome.source - 1 : connectome.source;
      connectome.target = connectome.target > node.idx ? connectome.target - 1 : connectome.target;
    })
    this.simulation.connectomes = connectomes;
    this.clean();
  }

  createLink(source: AppNode, target: AppNode): void {
    var connectomes = this.simulation.connectomes;
    var checkLinks = this.app.links.filter(link => (connectomes[link.idx].source == source.idx && connectomes[link.idx].target == target.idx));
    if (checkLinks.length == 0) {
      this.simulation.addConnectome(source.idx, target.idx)
      this.app.addLinks();
      this.clean();
    }
  }

  deleteLink(link: AppLink): void {
    this.app.links = this.app.links.filter(l => l.idx != link.idx);
    this.simulation.connectomes = this.simulation.connectomes.filter((connectome, idx) => idx != link.idx);
    this.app.links.forEach((l, idx) => l.idx = idx)
    this.clean();
  }

  clean(): void {
    this.app.clean(this);
    this.simulation.clean(this);
    this.cleanModels();
    this.updateHash();
    this.version = environment.VERSION;
  }

  updateHash(): void {
    this.hash = objectHash(this.simulation);
  }

  cleanModels(): void {
    var simModels = this.simulation.models;
    var appModels = this.app.models;
    this.simulation.models = {};
    this.app.models = {};
    this.app.nodes.forEach(node => {
      var collection = this.simulation.collections[node.idx];
      var newName = collection.element_type + '-' + this.label(node.idx);
      this.simulation.models[newName] = simModels[collection.model];
      this.app.models[newName] = appModels[collection.model];
      collection['model'] = newName;
    })
  }

  label(idx: number): string {
    var abc = 'abcdefghijklmnopqrstuvwxyz123456789';
    return abc[idx];
  }

}
