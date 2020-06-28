import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import * as objectHash from 'object-hash';

import { Data } from '../../classes/data';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private snackBar: MatSnackBar,
  ) {
  }

  clean(data: any): Data {
    // console.log('Clean data')
    var newData = JSON.parse(JSON.stringify(data));
    this.deleteGlobalIds(newData);
    this.cleanKernel(newData);
    this.hash(newData);
    return newData;
  }

  deleteGlobalIds(data: Data): void {
    data.app.nodes.forEach(node => {
      if (node.hasOwnProperty('global_ids')) {
        delete node.global_ids
      }
    })
  }

  cleanKernel(data: Data): void {
    data.app['kernel'] = { time: 0 };
    if (!data.simulation.kernel.hasOwnProperty('resolution')) {
      data.simulation.kernel['resolution'] = 0.1;
    }
  }

  hash(data: Data): void {
    data['hash'] = objectHash(data.simulation);
  }

}
