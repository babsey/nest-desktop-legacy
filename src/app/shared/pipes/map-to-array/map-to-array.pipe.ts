import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mapToArray'
})
export class MapToArrayPipe implements PipeTransform {

  transform(value, args:string[]) : any {
    let arr = [];
    var keys = Object.keys(value)
    keys.sort()
    keys.map(key => {
      arr.push({key: key, value: value[key]});
    })
    return arr;
  }

}
