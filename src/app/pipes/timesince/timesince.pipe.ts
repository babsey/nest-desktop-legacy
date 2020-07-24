import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timesince'
})
export class TimesincePipe implements PipeTransform {

  transform(value: any): string {
    const date: any = new Date(value);
    const now: any = new Date();
    const seconds: any = Math.floor((now - date) / 1000);

    if (seconds < 1) {
      return 'now'
    }

    let timesince: number;
    let timeunit: string;

    if (seconds > 31622400) {
      timesince = Math.floor(seconds / 31622400);
      timeunit = 'year';
      timeunit += (timesince == 1 ? '' : 's');
    } else if (seconds > 2635200) {
      timesince = Math.floor(seconds / 2635200);
      timeunit = 'month';
      timeunit += (timesince == 1 ? '' : 's');
    } else if (seconds > 86400) {
      timesince = Math.floor(seconds / 86400);
      timeunit = 'day';
      timeunit += (timesince == 1 ? '' : 's');
    } else if (seconds > 3600) {
      timesince = Math.floor(seconds / 3600);
      timeunit = 'hour';
      timeunit += (timesince == 1 ? '' : 's');
    } else if (seconds > 60) {
      timesince = Math.floor(seconds / 60);
      timeunit = 'min';
    } else {
      timesince = seconds;
      timeunit = 'sec';
    }

    return timesince + ' ' + timeunit + ' ago';
  }

}
