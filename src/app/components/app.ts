import { Config } from './config';
import { DatabaseService } from './database';
import { Model } from './model';
import { NESTServer } from './nestServer';
import { Project } from './project';

import { environment } from '../../environments/environment';


const pad = function(num: number, size: number = 2): string {
  let s: string = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

export class App {
  config: Config;                       // config
  version: string;
  ready: boolean = false;

  // Model
  modelDB: DatabaseService;
  models: Model[] = [];

  // Project
  projectDB: DatabaseService;
  projects: Project[] = [];
  project: Project;

  nestServer: NESTServer;

  constructor() {
    this.config = new Config(this);
    this.version = environment.VERSION;
    this.nestServer = new NESTServer();
    this.initProject();
    this.init();
  }

  get datetime(): string {
    const now: Date = new Date();
    const date: any[] = [now.getFullYear() - 2000, pad(now.getMonth() + 1), pad(now.getDate())];
    const time: any[] = [pad(now.getHours()), pad(now.getMinutes()), pad(now.getSeconds())];
    const datetime: string = date.join('') + '_' + time.join('');
    return datetime;
  }

  init(): Promise<any> {
    return this.initModels().then(() => this.initProjects().then(() => this.ready = true));
  }

  isConfigReady() {
    return this.config !== undefined;
  }

  isConfigValid() {
    return this.config.isValid();
  }

  resetConfigs() {
    localStorage.clear();
  }

  isDatabaseReady(): boolean {
    return (this.modelDB !== undefined && this.projectDB !== undefined);
  }

  isDatabaseValid(): boolean {
    if (!this.isDatabaseReady()) return false;
    return (this.modelDB.isValid() && this.projectDB.isValid());
  }

  isDataReady(): boolean {
    return (this.models.length > 0 && this.projects.length > 0)
  }

  resetDatabases(): void {
    this.ready = false;
    this.project = undefined;
    this.projects = [];
    this.models = [];
    this.resetModels().then(() => this.resetProjects().then(() => this.ready = true));
  }

  resetModelDatabases(): void {
    this.ready = false;
    this.models = [];
    this.resetModels().then(() => this.resetProjects().then(() => this.ready = true));
  }

  //
  // Model settings
  //

  initModels(): Promise<any> {
    console.log('Initialize models');
    this.modelDB = new DatabaseService(this, 'nest-desktop-model');
    this.models = [];
    return this.modelDB.count().then(count => {
      console.log('Models in db: ', count)
      if (count == 0) {
        return this.loadModelsFromFiles();
      } else {
        return this.modelDB.list().then(models =>
          models.forEach(model => this.models.push(new Model(this, model)))
        );
      }
    })
  }

  loadModelsFromFiles(): Promise<any> {
    console.log('Load models from files');
    let promise = Promise.resolve();
    this.config.data.models.forEach(file => {
      console.log('Load model from file:', file)
      const data: any = require('../../assets/models/' + file + '.json');
      promise = promise.then(() => this.addModel(data));
    })
    return promise;
  }

  resetModels(): Promise<any> {
    console.log('Reset model db');
    return this.modelDB.db.destroy().then(() => this.initModels());
  }

  getModel(modelId: string): Model {
    return this.models.find(model => model.id === modelId);
  }

  filterModels(elementType: string = null, sort: boolean = true): Model[] {
    const models: Model[] = elementType ? this.models.filter(model => model.elementType === elementType) : this.models;
    if (sort) {
      models.sort((a, b) => ('' + a.id).localeCompare(b.id));
    }
    return models;
  }

  addModel(data: any): Promise<any> {
    console.log('Add model:', data.id);
    const model: Model = new Model(this, data);
    this.models.push(model);
    return this.modelDB.create(model.serialize('db'));
  }

  saveModel(model: Model): Promise<any> {
    return this.modelDB.update(model.serialize('db'));
  }

  deleteModel(modelId: string): Promise<any> {
    this.models = this.models.filter(model => model.id !== modelId);
    return this.modelDB.delete(modelId);
  }

  //
  // Project
  //

  initProjects(): Promise<any> {
    console.log('Initialize projects');
    this.projectDB = new DatabaseService(this, 'nest-desktop-project');
    this.projects = [];
    return this.projectDB.count().then(count => {
      console.log('Projects in db:', count)
      if (count == 0) {
        return this.loadProjectFromFiles();
      } else {
        return this.projectDB.list().then(projects =>
          projects.forEach(project => this.projects.push(new Project(this, project)))
        );
      }
    })
  }

  loadProjectFromFiles(): Promise<any> {
    console.log('Load projects from files');
    let promise = Promise.resolve();
    this.config.data.projects.forEach(file => {
      console.log('Load project from file:', file)
      const data: any = require('../../assets/projects/' + file + '.json');
      promise = promise.then(() => this.addProject(data));
    })
    return promise;
  }

  resetProjects(): Promise<any> {
    console.log('Reset project db');
    return this.projectDB.db.destroy().then(() => this.initProjects())
  }

  initProject(id: string = ''): Promise<any> {
    console.log('Initialize project:', id);
    return new Promise(resolve => {
      if (this.projectDB && id) {
        this.projectDB.read(id).then(project => {
          this.project = new Project(this, project);
          this.project.code.generate()
          resolve(true)
        });
      } else {
        this.project = new Project(this);
        this.project.code.generate()
        resolve(true)
      }
    })
  }

  addProject(data: any): Promise<any> {
    console.log('Add project:', data.name)
    const project: Project = new Project(this, data);
    this.projects.push(project);
    return this.projectDB.create(project.serialize('db'));
  }

  addProjects(data: any[]): Promise<any> {
    const projects: Project[] = data.map(d => new Project(this, data));
    return this.projectDB.db.bulkDocs(
      projects.map(project => project.serialize('db'))
    );
  }

  saveProject(project: Project): Promise<any> {
    const p: any = project.serialize('db');
    const hashlist: string[] = this.projects.map(project => project.hash);
    if (hashlist.includes(p.hash) && p._id) {
      return this.projectDB.update(p);
    } else {
      return this.projectDB.create(p);
    }
  }

  deleteProject(projectId: string): Promise<any> {
    this.projects = this.projects.filter(project => project._id !== projectId);
    return this.projectDB.delete(projectId);
  }

  downloadProject(projectId: string): void {
    const project: Project = this.projects.find(project => project._id === projectId);
    this.download(project.serialize('file'), 'projects');
  }

  downloadProjects(projects: Project[]): void {
    const data: any[] = projects.map(project => project.serialize('file'))
    this.download(data, 'projects');
  }

  download(data: any, filenameSuffix: string = '') {
    const dataJSON: string = JSON.stringify(data);
    const element: any = document.createElement('a');
    element.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(dataJSON));
    element.setAttribute('download', "nest-desktop-" + filenameSuffix + "-" + this.datetime + ".json");
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

}
