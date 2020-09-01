import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';

import { enterAnimation } from '../../../animations/enter-animation';
import { listAnimation } from '../../../animations/list-animation';

import { AppService } from '../../../services/app/app.service';


@Component({
  selector: 'app-model-documentation',
  templateUrl: './model-documentation.component.html',
  styleUrls: ['./model-documentation.component.scss'],
  animations: [
    enterAnimation,
    listAnimation
  ],
})
export class ModelDocumentationComponent implements OnInit, OnChanges {
  @Input() model: string = '';
  public helptext: any = '';
  public blocks: any[] = [];
  public progress: boolean = false;
  public content: string = '';

  constructor(
    private _appService: AppService,
    private _http: HttpClient,
  ) { }

  ngOnInit() {
    // this.requestModelDoc()
  }

  ngOnChanges() {
    this.requestModelDoc()
  }

  requestModelDoc(): void {
    const urlRoot: string = this._appService.app.nestServer.url;
    const data: any = {
      'obj': this.model,
      'return_text': 'true',
    };
    this.progress = true;
    this.helptext = "";
    this.blocks = [];
    setTimeout(() => {
      this._http.post(urlRoot + '/api/help', data).subscribe(resp => {
        if (resp === undefined || resp === null) return
        this.helptext = resp;
        this.progress = false;
        const titles: string[] = ['Synopsis', 'Description', 'Parameters', 'Examples', 'Receives', 'Sends', 'Transmits', 'Remarks', 'References', 'Availability', 'Authors', 'Author', 'FirstVersion', 'SeeAlso', 'Source'];
        const lines: string[] = this.helptext.split('\n');
        let blocks: any[] = titles.map(b => [lines.indexOf(b + ':'), b])
        blocks = blocks.sort((a, b) => a[0] - b[0]);
        blocks = blocks.filter(b => b[0] != -1);
        const content: any = {};
        blocks.map((b, i) => {
          const start: number = parseInt(b[0]) + 2;
          const end: number = i < blocks.length - 1 ? parseInt(blocks[i + 1][0]) - 2 : blocks.length;
          content[b[1]] = lines.slice(start, end).join('\n');
        })
        this.blocks = titles.filter(title => content[title]).map(title => {
          return {
            title: title,
            content: content[title],
          }
        })
        this.blocks.unshift({
          content: lines[0].split(' - ')[1],
        })
      },
        error => {
          this.progress = false;
          // this.helptext = JSON.stringify(error['error']);
        }
      )
    }, 500)
  }

}
