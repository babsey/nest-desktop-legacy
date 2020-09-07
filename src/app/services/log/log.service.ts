import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private _logs: any[] = [];
  private _time = new Date();

  constructor() {
  }

  get logs(): any[] {
    return this._logs;
  }

  get time(): Date {
    return this._time;
  }

  set time(value: Date) {
    this._time = value
  }

  reset(): void {
    this._time = new Date();
    this._logs = [[this.time, 'client', 'Start log']]
  }

  log(message: string): void {
    this._logs.push([new Date(), 'client', message])
  }

}
