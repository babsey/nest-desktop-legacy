import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timedelta'
})
export class TimedeltaPipe implements PipeTransform {

  transform(value: any, time: any): string {
    value = new Date(value);
    time = new Date(time);
    const milliseconds: any = (value - time);
    const dt: number = Math.abs(milliseconds);

    let timedelta: number;
    let timeunit: string;

    if (dt > 3600000) {
      timedelta = Math.floor(dt / 3600000);
      timeunit = 'h';
    } else if (dt > 60000) {
      timedelta = Math.floor(dt / 60000);
      timeunit = 'm';
    } else if (dt > 1000) {
      timedelta = dt / 1000;
      timeunit = 's';
    } else {
      timedelta = dt;
      timeunit = 'ms';
    }

    return (milliseconds < 0 ? '-' : '') + timedelta + ' ' + timeunit;
  }

}
