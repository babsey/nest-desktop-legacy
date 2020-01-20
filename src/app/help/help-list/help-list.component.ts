import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-help-list',
  templateUrl: './help-list.component.html',
  styleUrls: ['./help-list.component.scss']
})
export class HelpListComponent implements OnInit {

  constructor(
    public router: Router,
  ) { }

  ngOnInit(): void {
  }

  navigate(path: string): void {
    this.router.navigate([{outlets: {primary: 'help/' + path, nav: 'help'}}]);
  }

  isActive(path: string): boolean {
    return this.router.url.includes('help/' + path)
  }

}
