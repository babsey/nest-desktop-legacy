import { Component, OnInit } from '@angular/core';

import { enterAnimation } from '../../animations/enter-animation';

import { AppService } from '../../services/app/app.service';


@Component({
  selector: 'app-startpage',
  templateUrl: './startpage.component.html',
  styleUrls: ['./startpage.component.scss'],
  animations: [enterAnimation],
})
export class StartpageComponent implements OnInit {

  constructor(
    private _appService: AppService,
  ) { }

  ngOnInit() {
  }

  get version(): string {
    return this._appService.app.version;
  }

}
