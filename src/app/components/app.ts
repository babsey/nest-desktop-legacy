import { AppView } from './appView';
import { Config } from './config';
import { DatabaseService } from './database';
import { Model } from './model/model';
import { NESTServer } from './server/nestServer';
import { Project } from './project/project';

import { environment } from '../../environments/environment';


const pad = (num: number, size: number = 2): string => {
  let s: string = num + '';
  while (s.length < size) {
    s = '0' + s;
  }
  return s;
};

export class App extends Config {
  private _version: string;
  private _ready = false;
  view: AppView;

  // NEST model e.g. neuron, synapse, stimulator, recorder
  modelDB: DatabaseService;
  models: Model[] = [];

  // Project of neuronal networks
  projectDB: DatabaseService;
  projects: Project[] = [];
  projectRevisions: Project[] = [];
  project: Project;

  nestServer: NESTServer = new NESTServer();

  constructor() {
    super('App');
    this._version = environment.VERSION;
    this.view = new AppView(this);
    this.init();
  }

  get datetime(): string {
    const now: Date = new Date();
    const date: any[] = [now.getFullYear() - 2000, pad(now.getMonth() + 1), pad(now.getDate())];
    const time: any[] = [pad(now.getHours()), pad(now.getMinutes()), pad(now.getSeconds())];
    const datetime: string = date.join('') + '_' + time.join('');
    return datetime;
  }

  get ready(): boolean {
    return this._ready;
  }

  get version(): string {
    return this._version;
  }

  init(): Promise<any> {
    this.project = new Project(this);
    this._ready = false;
    return this.initModels()
      .then(() => this.initProjects()
        .then(() => this._ready = true));
  }

  /*
  Database
  */

  isDatabaseReady(): boolean {
    return (this.modelDB !== undefined && this.projectDB !== undefined);
  }

  isDatabaseValid(): boolean {
    if (!this.isDatabaseReady()) { return false; }
    return (this.modelDB.isValid() && this.projectDB.isValid());
  }

  isDataReady(): boolean {
    return (this.models.length > 0 && this.projects.length > 0);
  }

  resetDatabases(): void {
    this._ready = false;
    this.resetModelDatabase()
      .then(() => this.resetProjectDatabase()
        .then(() => this._ready = true));
  }

  resetModelDatabase(): Promise<any> {
    this.models = [];
    return this.modelDB.db.destroy()
      .then(() => this.initModels());
  }

  resetProjectDatabase(): Promise<any> {
    this.project = new Project(this);
    this.projects = [];
    return this.projectDB.db.destroy()
      .then(() => this.initProjects());
  }


  /*
  Models
  */

  initModels(): Promise<any> {
    // console.log('Initialize models');
    this.models = [];
    this.modelDB = new DatabaseService(this, 'nest-desktop-model');
    return this.modelDB.count().then((count: number) => {
      console.log('Models in db:', count);
      if (count === 0) {
        return this.loadModelsFromFiles().then(() => this.initModels());
      } else {
        return this.updateModels();
      }
    });
  }

  loadModelsFromFiles(): Promise<any> {
    // console.log('Load models from files');
    let promise: Promise<any> = Promise.resolve();
    this.config.models.forEach((file: string) => {
      console.log('Load model from file:', file);
      const data: any = require('../../assets/models/' + file + '.json');
      promise = promise.then(() => this.addModel(data));
    });
    return promise;
  }

  filterModels(elementType: string = null): Model[] {
    if (elementType === null) { return this.models; }
    return this.models.filter((model: Model) => model.elementType === elementType);
  }

  updateModels(): Promise<any> {
    return this.modelDB.list('id').then((models: any[]) =>
      models.forEach((model: any) => {
        this.models.push(new Model(this, model));
      })
    );
  }

  /*
  Model
  */

  addModel(data: any): Promise<any> {
    // console.log('Add model:', data.id);
    const model: Model = new Model(this, data);
    return this.modelDB.create(model);
  }

  deleteModel(docId: string): Promise<any> {
    return this.modelDB.delete(docId);
  }

  getModel(modelId: string): Model {
    return this.models.find((model: Model) =>
      model.id === modelId) || new Model(this, { id: modelId, params: [] });
  }

  hasModel(modelId: string): boolean {
    return this.models.find((model: Model) => model.id === modelId) !== undefined;
  }

  saveModel(model: Model): Promise<any> {
    return this.modelDB.update(model);
  }

  createNeuronModelProject(model: string): Project {
    const data: any = require('../../assets/projects/neuron-spike-response.json');
    data.network.nodes[1].model = model;
    return new Project(this, data);
  }

  /*
  Projects
  */

  // Add projects to list and database.
  addProjects(data: any[]): Promise<any> {
    console.log('Add projects');
    const projects: any[] = data.map((project: any) =>
      new Promise((resolve, reject) => {
        this.addProject(project).then(() => {
          resolve();
        });
      }));
    return Promise.all(projects);
  }

  // Delete projects from database and then update the list.
  deleteProjects(projectIds: string[]): Promise<any> {
    return this.projectDB.deleteBulk(projectIds).then(this.updateProjects());
  }

  // Downloads projects from the list.
  downloadProjects(projectIds: string[]): void {
    const projects: Project[] = this.projects.filter((project: Project) =>
      projectIds.includes(project.id));
    const data: any[] = projects.map((project: Project) => project.toJSON());
    this.download(data, 'projects');
  }

  // Initialize project list either from database or from files.
  initProjects(): Promise<any> {
    // console.log('Initialize projects');
    this.projects = [];
    this.projectRevisions = [];
    this.projectDB = new DatabaseService(this, 'nest-desktop-project');
    return this.projectDB.count().then((count: number) => {
      console.log('Projects in db:', count);
      if (count > 0) {
        return this.updateProjects();
      } else {
        return this.loadProjectsFromFiles();
      }
    });
  }

  // Load projects from files and adds them to list and database.
  loadProjectsFromFiles(): Promise<any> {
    // console.log('Load projects from files');
    let promise: Promise<any> = Promise.resolve();
    this.config.projects.forEach((file: string) => {
      // console.log('Load project from file:', file);
      const data: any = require('../../assets/projects/' + file + '.json');
      promise = promise.then(() => this.addProject(data));
    });
    return promise;
  }

  // Load projects from database and then update list
  updateProjects(): Promise<any> {
    return this.projectDB.list('createdAt', true).then((projects: any[]) =>
      this.projects = projects.map((project: any) => new Project(this, project))
    );
  }

  // Load project revision from database and then update revision list
  updateProjectRevisions(id: string = null): Promise<any> {
    this.projectRevisions = [];
    if (id === null) { return; }
    return this.projectDB.revisions(id)
      .then((revIds: string[]) =>
        revIds.forEach((rev: string) =>
          this.projectDB.read(id, rev).then((doc: any) =>
            this.projectRevisions.push(new Project(this, doc)))
        )
      );
  }

  /*
  Current project
  */

  // Add project to list and database.
  addProject(data: any): Promise<any> {
    // console.log('Add project:', data.name);
    const project: Project = new Project(this, data);
    this.projects.unshift(project);
    return this.projectDB.create(project);
  }

  // Delete project in database and remove it from the list.
  deleteProject(projectId: string): Promise<any> {
    // console.log('Delete project:', projectId);
    return this.projectDB.delete(projectId).then(this.updateProjects());
  }

  // Download project from the list.
  downloadProject(projectId: string): void {
    // console.log('Download project:', projectId);
    const project: Project = this.projects.find((p: Project) => p.id === projectId);
    this.download(project.toJSON('file'), 'projects');
  }

  // Initialize project or project revision from the list.
  initProject(id: string = '', rev: string = ''): Promise<any> {
    // console.log(`Initialize project: id=${id}, rev=${rev}`);
    return new Promise((resolve, reject) => {
      try {
        if (id && rev) {
          this.project = this.projectRevisions.find(
            (project: Project) => (project.id === id && project.rev === rev));
        } else if (id) {
          this.project = this.projects.find(
            (project: Project) => project.id === id);
        } else {
          this.newProject();
        }
        resolve(true);
      } catch {
        console.log('Error in project initialization');
        this.newProject();
        reject(true);
      }
    });
  }

  // Create a new project and add it to the list but not to the database.
  newProject(): void {
    this.project = new Project(this);
    this.updateProject(this.project);
  }

  // Reload the current project in the list from the database.
  reloadProject(project: Project): Promise<any> {
    return this.projectDB.read(project.id).then((doc: any) => {
      this.project = new Project(this, doc);
      const idx: number = this.projects.map((p: Project) => p.id).indexOf(project.id);
      this.projects[idx] = this.project;
    });
  }

  // Save the project in the database and then update the list.
  saveProject(project: Project): Promise<any> {
    // console.log('Save project:', project.name);
    project.clean();
    const promise: Promise<any> = project.id ? this.projectDB.update(project) : this.projectDB.create(project);
    return promise.then(() => this.updateProject(this.project));
  }

  // Remove project from the list.
  unloadProject(project: Project): void {
    const idx: number = this.projects.map((p: Project) => p.id).indexOf(project.id);
    if (idx !== -1) {
      this.projects = this.projects.slice(0, idx).concat(this.projects.slice(idx + 1));
    }
  }

  // Add project to the top of the list.
  updateProject(project: Project): void {
    this.unloadProject(project);
    this.projects.unshift(project);
  }

  /*
  General
  */

  download(data: any, filenameSuffix: string = '') {
    const dataJSON: string = JSON.stringify(data);
    const element: any = document.createElement('a');
    element.setAttribute('href', 'data:text/json;charset=UTF-8,' + encodeURIComponent(dataJSON));
    element.setAttribute('download', `nest-desktop-${filenameSuffix}-${this.datetime}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

}
