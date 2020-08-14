import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-config-all',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit, OnDestroy {
  private subscription: any;
  public currentSection = 'nest-server';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      if ('setting' in params) {
        this.currentSection = params['setting'];
        setTimeout(() => document.querySelector('#' + this.currentSection).scrollIntoView({ behavior: 'smooth'}), 100);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  navigate(sectionId: string): void {
    this.router.navigate([{ outlets: { primary: 'setting/' + sectionId, nav: 'setting' } }]);
  }

  isActive(sectionId: string): boolean {
    return this.currentSection === sectionId;
  }

}
