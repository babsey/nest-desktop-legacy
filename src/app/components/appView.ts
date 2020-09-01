import { App } from './app';
import { Project } from './project/project';

export class AppView {
  app: App;                       // parent

  projectSearchTerm: string = '';

  constructor(app: App) {
    this.app = app;
  }

  get filteredProjects(): Project[] {
    if (this.projectSearchTerm === '') return this.app.projects;
    return this.app.projects.filter(project =>
        project.name.toLowerCase().indexOf(this.projectSearchTerm.toLowerCase()) > -1
      );
  }

}
