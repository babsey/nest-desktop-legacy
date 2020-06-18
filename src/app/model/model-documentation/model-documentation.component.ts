import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { NestServerService } from '../../nest-server/nest-server.service';

import { enterAnimation } from '../../animations/enter-animation';
import { listAnimation } from '../../animations/list-animation';


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

  constructor(
    private _nestServerService: NestServerService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    // this.requestModelDoc()
  }

  ngOnChanges(): void {
    this.requestModelDoc()
  }

  requestModelDoc(): void {
    var urlRoot = this._nestServerService.url();
    var data = {
      'obj': this.model,
      'return_text': 'true',
    };
    this.progress = true;
    this.helptext = "";
    this.blocks = [];
    setTimeout(() => {
      this.http.post(urlRoot + '/api/nest/help', data).subscribe(resp => {
        this.helptext = resp;
        this.progress = false;
        var titles = ['Synopsis', 'Description', 'Parameters', 'Examples', 'Receives', 'Sends', 'Transmits', 'Remarks', 'References', 'Availability', 'Authors', 'Author', 'FirstVersion', 'SeeAlso', 'Source'];
        var lines = this.helptext.split('\n');
        var blocks: any[] = titles.map(b => [lines.indexOf(b + ':'), b])
        blocks = blocks.sort((a, b) => a[0] - b[0]);
        blocks = blocks.filter(b => b[0] != -1);
        var content = {};
        blocks.map((b, i) => {
          var start = parseInt(b[0]) + 2;
          var end = i < blocks.length - 1 ? parseInt(blocks[i + 1][0]) - 2 : blocks.length;
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
          this.helptext = JSON.stringify(error['error']);
        }
      )
    }, 500)
  }

}
