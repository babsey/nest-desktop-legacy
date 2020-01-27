import { Component, OnInit } from '@angular/core';

import { LoadingService } from '../loading/loading.service';
import { enterAnimation } from '../animations/enter-animation';

import { environment } from '../../environments/environment';


@Component({
  selector: 'app-startpage',
  templateUrl: './startpage.component.html',
  styleUrls: ['./startpage.component.scss'],
  animations: [enterAnimation],
})
export class StartpageComponent implements OnInit {
  public version = environment.VERSION;

  constructor(
    public _loadingService: LoadingService,
  ) { }

  ngOnInit(): void {
  }

}
