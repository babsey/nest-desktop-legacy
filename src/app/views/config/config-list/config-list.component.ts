import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { enterAnimation } from '../../../animations/enter-animation';


@Component({
  selector: 'app-config-list',
  templateUrl: './config-list.component.html',
  styleUrls: ['./config-list.component.scss'],
  animations: [enterAnimation]
})
export class ConfigListComponent implements OnInit {

  constructor(
    private _router: Router,
  ) { }

  ngOnInit() {
  }

  navigate(path: string): void {
    this._router.navigate([{ outlets: { primary: 'setting/' + path, nav: 'setting' } }]);
  }

  isActive(path: string): boolean {
    return this._router.url.includes('/setting/' + path);
  }

  reset(): void {
    localStorage.clear();
  }

}
