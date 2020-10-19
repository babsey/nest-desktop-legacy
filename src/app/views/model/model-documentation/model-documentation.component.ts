import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { enterAnimation } from '../../../animations/enter-animation';
import { listAnimation } from '../../../animations/list-animation';

import { HttpClient } from '../../../components/server/httpClient';

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
  @Input() modelId = '';
  private _blocks: any[] = [];
  private _helptext: any = '';

  constructor(
    private _appService: AppService,
  ) { }

  ngOnInit() {
    // this.requestModelDoc()
  }

  ngOnChanges() {
    this.requestModelDoc();
  }

  get http(): HttpClient {
    return this._appService.app.nestServer.http;
  }

  get blocks(): any[] {
    return this._blocks;
  }

  requestModelDoc(): void {
    this._helptext = '';
    this._blocks = [];
    if (!this.modelId) { return; }
    setTimeout(() => {
      const urlRoot: string = this._appService.app.nestServer.url;
      const data: any = {
        obj: this.modelId,
        return_text: 'true',
      };
      this.http.post(urlRoot + '/api/help', data)
        .then((req: any) => {
          if (req.status !== 200) { return; }
          this._helptext = JSON.parse(req.responseText);
          const titles: string[] = ['Synopsis', 'Description', 'Parameters', 'Examples', 'Receives', 'Sends', 'Transmits', 'Remarks', 'References', 'Availability', 'Authors', 'Author', 'FirstVersion', 'SeeAlso', 'Source'];
          const lines: string[] = this._helptext.split('\n');
          let blocks: any[] = titles.map((title: string) => [lines.indexOf(title + ':'), title]);
          blocks = blocks.sort((a: any, b: any) => a[0] - b[0]);
          blocks = blocks.filter((block: any) => block[0] !== -1);
          const content: any = {};
          blocks.map((block: string, i: number) => {
            const start: number = parseInt(block[0], 0) + 2;
            const end: number =
              i < blocks.length - 1
                ? parseInt(blocks[i + 1][0], 0) - 2
                : blocks.length;
            content[block[1]] = lines.slice(start, end).join('\n');
          });
          this._blocks = titles.filter((title: string) => content[title])
            .map((title: string) => {
              return {
                title,
                content: content[title],
              };
            });
          this.blocks.unshift({
            content: lines[0].split(' - ')[1],
          });
        })
        .catch((req: any) => {
          console.log(req);
        });
    }, 500);
  }

}
