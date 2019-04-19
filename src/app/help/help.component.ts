import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit, OnDestroy {
  public help: string = '';
  private subscription: any;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      if ('help' in params) {
        this.help = params['help'];
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

}
