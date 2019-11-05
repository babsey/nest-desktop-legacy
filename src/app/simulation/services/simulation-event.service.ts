import { Injectable, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { AppNode } from '../../classes/appNode';
import { Data } from '../../classes/data';
import { Record } from '../../classes/record';


@Injectable({
  providedIn: 'root'
})
export class SimulationEventService {
  public records: Record[];

  constructor(
    private snackBar: MatSnackBar,
  ) {
  }

  download(data: Data, node: AppNode): void {
    var records = this.records.filter(record => record.recorder.idx == node.idx);
    if (records.length == 0) {
      this.snackBar.open('No record found. Please simulate.', null, {
        duration: 2000,
      });
    } else {
      var record = records[0];
      var recordJSON = JSON.stringify(record);
      var element = document.createElement('a');
      element.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(recordJSON));
      var now = new Date().toLocaleString();
      element.setAttribute('download', data.name + "_" + record.recorder.model + "_" + now + ".json");
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }

  }

}
