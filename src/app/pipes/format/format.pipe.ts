import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'format'
})
export class FormatPipe implements PipeTransform {

  transform(value: any): number {
    return value % 1 === 0 ? value : value.toFixed(1);
  }

}
