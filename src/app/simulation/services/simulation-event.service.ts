import { Injectable, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  pad(num: number, size: number = 2): string {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
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
      var now = new Date();
      var date = [now.getFullYear() - 2000, this.pad(now.getMonth() + 1), this.pad(now.getDate())];
      var time = [this.pad(now.getHours()), this.pad(now.getMinutes()), this.pad(now.getSeconds())];
      var datetime = date.join('') + '_' + time.join('');
      element.setAttribute('download', "NEST_Desktop-" + datetime + "-" + data.name + "-" + record.recorder.model + ".json");
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }

  }

}
