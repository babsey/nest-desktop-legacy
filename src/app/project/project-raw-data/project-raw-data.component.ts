import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { AppService } from '../../app.service';
import { NetworkService } from '../../network/services/network.service';



@Component({
  selector: 'app-project-raw-data',
  templateUrl: './project-raw-data.component.html',
  styleUrls: ['./project-raw-data.component.scss']
})
export class ProjectRawDataComponent implements OnInit, OnDestroy {
  public options: any = {
    cursorBlinkRate: 700,
    foldGutter: true,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    lineNumbers: true,
    lineWrapping: true,
    readOnly: true,
    mode: { name: 'javascript', json: true }
  };
  public content: any;
  private subscription: any;

  constructor(
    private _appService: AppService,
    private _networkService: NetworkService,
  ) { }

  ngOnInit() {
    this.subscription = this._networkService.update.subscribe(() => this.update());
    this.update();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  update(): void {
    setTimeout(() => {
      this.content = JSON.stringify(this._appService.data.project.serialize('db'), null, "\t");
    }, 100)
  }

}
