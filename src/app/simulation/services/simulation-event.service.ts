import { Injectable, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Project } from '../../components/project';
import { Node } from '../../components/node';


@Injectable({
  providedIn: 'root'
})
export class SimulationEventService {

  constructor(
    private snackBar: MatSnackBar,
  ) {
  }

  pad(num: number, size: number = 2): string {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }

  download(project: Project, node: Node): void {
    node.downloadEvents()

    // var activities = project.activities.filter(activity => activity.recorder.idx == node.idx);
    // if (activities.length == 0) {
    //   this.snackBar.open('No record found. Please simulate.', null, {
    //     duration: 2000,
    //   });
    // } else {
    //   var activity = activities[0];
    //   var activityJSON = JSON.stringify(activity);
    //   var element = document.createElement('a');
    //   element.setAttribute('href', "project:text/json;charset=UTF-8," + encodeURIComponent(activityJSON));
    //   var now = new Date();
    //   var date = [now.getFullYear() - 2000, this.pad(now.getMonth() + 1), this.pad(now.getDate())];
    //   var time = [this.pad(now.getHours()), this.pad(now.getMinutes()), this.pad(now.getSeconds())];
    //   var datetime = date.join('') + '_' + time.join('');
    //   element.setAttribute('download', "NEST_Desktop-" + datetime + "-" + project.name + "-" + activity.recorder.model + ".json");
    //   element.style.display = 'none';
    //   document.body.appendChild(element);
    //   element.click();
    //   document.body.removeChild(element);
    // }

  }

}
