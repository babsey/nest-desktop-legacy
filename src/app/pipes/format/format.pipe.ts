import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'format'
})
export class FormatPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value % 1 == 0 ? value : value.toFixed(1);
  }

}
