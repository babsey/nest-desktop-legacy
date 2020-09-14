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
  @Input() modelId: string = '';
  private _helptext: any = '';
  private _blocks: any[] = [];

  constructor(
    private _appService: AppService,
    private _http: HttpClient,
  ) { }

  ngOnInit() {
    // this.requestModelDoc()
  }

  ngOnChanges() {
    this.requestModelDoc();
  }

  get blocks(): any[] {
    return this._blocks;
  }

  requestModelDoc(): void {
    this._helptext = '';
    this._blocks = [];
    setTimeout(() => {
      const urlRoot: string = this._appService.app.nestServer.url;
      const data: any = {
        obj: this.modelId,
        return_text: 'true',
      };
      this._http.post(urlRoot + '/api/help', data).subscribe((resp: string) => {
        if (resp === undefined || resp === null) { return; }
        this._helptext = resp;
        const titles: string[] = ['Synopsis', 'Description', 'Parameters', 'Examples', 'Receives', 'Sends', 'Transmits', 'Remarks', 'References', 'Availability', 'Authors', 'Author', 'FirstVersion', 'SeeAlso', 'Source'];
        const lines: string[] = this._helptext.split('\n');
        let blocks: any[] = titles.map((title: string) => [lines.indexOf(title + ':'), title]);
        blocks = blocks.sort((a: any, b: any) => a[0] - b[0]);
        blocks = blocks.filter((block: any) => block[0] !== -1);
        const content: any = {};
        blocks.map((block: string, i: number) => {
          const start: number = parseInt(block[0]) + 2;
          const end: number = i < blocks.length - 1 ? parseInt(blocks[i + 1][0]) - 2 : blocks.length;
          content[block[1]] = lines.slice(start, end).join('\n');
        });
        this._blocks = titles.filter((title: string) => content[title])
          .map((title: string) => {
            return {
              title: title,
              content: content[title],
            };
          });
        this.blocks.unshift({
          content: lines[0].split(' - ')[1],
        });
      }, (err: any) => {
        // this.helptext = JSON.stringify(error['error']);
      });
    }, 500);
  }

}
