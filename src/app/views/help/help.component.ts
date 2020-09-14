import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit, OnDestroy {
  private _help = '';
  private _subscription: any;

  constructor(
    private _route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this._subscription = this._route.params.subscribe((params: any): void => {
      if ('help' in params) {
        this._help = params.help;
      }
    });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  get help(): string {
    return this._help;
  }

}
