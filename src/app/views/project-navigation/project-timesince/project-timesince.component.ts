import { Component, OnInit, OnChanges, OnDestroy, Input } from '@angular/core';



@Component({
  selector: 'app-project-timesince',
  templateUrl: './project-timesince.component.html',
  styleUrls: ['./project-timesince.component.scss'],
})
export class ProjectTimesinceComponent implements OnInit, OnChanges, OnDestroy {
  @Input() date: string;
  private _value: string;
  private _intervalId: any;

  constructor() {
  }

  ngOnInit() {
    this._intervalId = setInterval(() => { this._value = this.timer(); }, 60 * 1000);
    this._value = this.timer();
  }

  ngOnChanges() {
    this._value = this.timer();
  }

  ngOnDestroy() {
    clearInterval(this._intervalId);
  }

  get value(): string {
    return this._value;
  }

  timer(): string {
    const seconds = Math.floor((+new Date() - +new Date(this.date)) / 1000);
    if (seconds < 60) { return 'Just now'; }
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };
    let counter;
    for (const i in intervals) {
      counter = Math.floor(seconds / intervals[i]);
      if (counter > 0) {
        if (counter === 1) {
          return counter + ' ' + i + ' ago'; // singular (1 day ago)
        } else {
          return counter + ' ' + i + 's ago'; // plural (2 days ago)
        }
      }
    }
  }

}
