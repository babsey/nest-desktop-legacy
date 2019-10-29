import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit, OnDestroy {
  public routeConfig: any;
  private subscription: any;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      if ('config' in params) {
        this.routeConfig = params['config'];
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  reset(): void {
  }

  download(): void {
  }

  upload(): void {
  }

}
