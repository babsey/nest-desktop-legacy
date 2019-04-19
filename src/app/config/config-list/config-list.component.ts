import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Router } from '@angular/router';
import { NavigationService } from '../../navigation/navigation.service';

@Component({
  selector: 'app-config-list',
  templateUrl: './config-list.component.html',
  styleUrls: ['./config-list.component.css']
})
export class ConfigListComponent implements OnInit {
  @Output() configClick = new EventEmitter();

  constructor(
    private router: Router,
    public _navigationService: NavigationService,
  ) { }

  ngOnInit() {
  }

  navigate(path) {
    this.router.navigate([{outlets: {primary: 'config/' + path, sidebar: 'config'}}]);
    this.configClick.emit()
  }

  isActive(path) {
    return this.router.url.includes('/config/' + path)
  }

}
