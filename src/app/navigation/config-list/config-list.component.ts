import { Component, OnInit } from '@angular/core';

import {
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-config-list',
  templateUrl: './config-list.component.html',
  styleUrls: ['./config-list.component.css']
})
export class ConfigListComponent implements OnInit {

  public faChevronRight = faChevronRight;

  constructor() { }

  ngOnInit() {
  }

}
