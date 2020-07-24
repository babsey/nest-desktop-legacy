import { Component, OnInit } from '@angular/core';

import { AppService } from '../app.service';
import { enterAnimation } from '../animations/enter-animation';


@Component({
  selector: 'app-startpage',
  templateUrl: './startpage.component.html',
  styleUrls: ['./startpage.component.scss'],
  animations: [enterAnimation],
})
export class StartpageComponent implements OnInit {

  constructor(
    public _appService: AppService,
  ) { }

  ngOnInit() {
  }

}
