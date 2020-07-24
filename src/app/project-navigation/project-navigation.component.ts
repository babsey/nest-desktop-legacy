import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AppService } from '../app.service';
import { Project } from '../components/project';

import { enterAnimation } from '../animations/enter-animation';


@Component({
  selector: 'app-project-navigation',
  templateUrl: './project-navigation.component.html',
  styleUrls: ['./project-navigation.component.scss'],
  animations: [ enterAnimation ],
})
export class ProjectNavigationComponent implements OnInit, OnDestroy {
  @ViewChild('file', { static: false }) file;
  private subscription: any;
  public filteredProjects: Project[] = [];
  public searchTerm: string = '';
  public selectionList: boolean = false;
  public fileReader = new FileReader();
  public quickview: boolean = false;

  constructor(
    private router: Router,
    public _appService: AppService,
  ) {
    this.fileReader.addEventListener("load", event => {
      const result: any = JSON.parse(event['target']['result'] as string);
      const data: any[] = result.hasOwnProperty("_id") ? [result] : result;
      const projects: Project[] = data.map(d => new Project(this._appService.data, d));
      this._appService.upload(projects);
    });
  }

  ngOnInit() {
    this.subscription = this._appService.change.subscribe(() => this.update())
    this.update()
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  update(): void {
    console.log('Update projects')
    this.filter();
    // this.projects = this._appService.data.projects;
    // this._projectService.list().then(simulations => {
    //   if (simulations != undefined && simulations.length != 0) {
    //     simulations.map(simulation => simulation.source = 'simulation')
    //     this.simulations = simulations;
    //   }
    //   this._simulationProtocolService.list().then(protocols => {
    //     if (protocols != undefined && protocols.length != 0) {
    //       protocols.map(protocol => protocol.source = 'protocol')
    //       this.simulations = this.simulations.concat(protocols);
    //     }
    //     this.simulations = this.simulations.sort(this.sortByDate('updatedAt'));
    //     this.filter();
    //   })
    // })
  }

  sortByDate(key: string): any {
    return (a: any, b: any) => {
      const dateB: any = new Date(b[key]);
      const dateA: any = new Date(a[key]);
      return dateB - dateA;
    }
  }

  search(query: string): void {
    this.searchTerm = query;
    this.filter();
  }

  filter(): void {
    // https://stackblitz.com/edit/angular-material-mat-select-filter
    // this.filteredSimulations = this.simulations;
    if (this.searchTerm) {
      this.filteredProjects = this._appService.data.projects.filter(project =>
        project.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1
      )
    } else {
      this.filteredProjects = this._appService.data.projects;
    }
  }

  downloadProjects(projects: Project[] = []): void {
    if (projects === []) {
      projects = this._appService.data.projects;
    }
    this._appService.data.downloadProjects(projects);
  }

  openUploadDialog(): void {
    this.file.nativeElement.click();
  }


  saveProject(): void {
    this._appService.data.project.save().then(() => setTimeout(() => this.update(), 100))
  }

  cleanProjectDatabase(): void {
    this._appService.data.resetProjects().then(() => {
      this.update()
    }).catch((err) => {
      console.log(err)
    });
  }

  navigate(id: string): void {
    const url: string = 'project/' + id;
    this.router.navigate([{ outlets: { primary: url } }]);
  }

  deleteProjects(projects: string[]): void {
    this._appService.data.projectDB.deleteBulk(projects)
      .then(() => {
        setTimeout(() => {
          this.update()
          this.selectionList = false;
        }, 100)
      });
  }

  newNetwork(): void {
    this.selectionList = false;
    this.navigate('')
  }

  displaySaveButton(): boolean {
    return this._appService.data.project.id === '' && this._appService.data.project.name != '';
  }

  clearProjectName(): void {
    this._appService.data.project.name = '';
  }

  onSelect(event: any): void {
    switch (event.mode) {
      case 'delete':
        this.deleteProjects(event.selected);
        break;
      case 'download':
        const projects: Project[] = this._appService.data.projects.filter(project => event.selected.indexOf(project._id) != -1)
        this.downloadProjects(projects);
        this.selectionList = false;
        break;
      case 'navigate':
        this.navigate(event.id)
      default:
        this.selectionList = false;
    }
  }

  onFileAdded(): void {
    this.fileReader.readAsText(this.file.nativeElement.files[0]);
  }

}
