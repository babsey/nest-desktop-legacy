import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Router } from '@angular/router';
import { NavigationService } from '../../navigation/navigation.service';

@Component({
  selector: 'app-config-list',
  templateUrl: './config-list.component.html',
  styleUrls: ['./config-list.component.scss']
})
export class ConfigListComponent implements OnInit {
  @Output() configClick: EventEmitter<any> = new EventEmitter();

  constructor(
    private router: Router,
    public _navigationService: NavigationService,
  ) { }

  ngOnInit() {
  }

  navigate(path) {
    this.router.navigate([{outlets: {primary: 'config/' + path, nav: 'config'}}]);
    this.configClick.emit()
  }

  isActive(path) {
    return this.router.url.includes('/config/' + path)
  }

}
