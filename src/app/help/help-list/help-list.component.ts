import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-help-list',
  templateUrl: './help-list.component.html',
  styleUrls: ['./help-list.component.css']
})
export class HelpListComponent implements OnInit {

  constructor(
    public router: Router,
  ) { }

  ngOnInit() {
  }

  navigate(path) {
    this.router.navigate([{outlets: {primary: 'help/' + path, sidebar: 'help'}}]);
  }

  isActive(path) {
    return this.router.url.includes('help/' + path)
  }

}
