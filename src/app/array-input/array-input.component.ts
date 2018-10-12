import { Component, OnInit, Input } from '@angular/core';

import { MatDialog } from '@angular/material';

import { DataService } from '../shared/services/data/data.service';
import { SimulationService } from '../shared/services/simulation/simulation.service';
import { GeneratorService } from '../shared/services/generator/generator.service';

import { ArrayGeneratorDialogComponent } from '../shared/dialogs/array-generator-dialog/array-generator-dialog.component';

import {
  faDice,
} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-array-input',
  templateUrl: './array-input.component.html',
  styleUrls: ['./array-input.component.css']
})
export class ArrayInputComponent implements OnInit {
  @Input() id: any;
  @Input() data: any;
  @Input() options: any = {};

  public faDice = faDice;

  constructor(
    private _simulationService: SimulationService,
    private _dataService: DataService,
    private _generatorService: GeneratorService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  changed(event) {
    var value = event.target.value;
    if (value.length == 0) {
      delete this.data[this.id];
    } else {
      var valueArray = value.split(",");
      this.data[this.id] = valueArray.map(d => parseFloat(d))
    }
    this._simulationService.run()
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ArrayGeneratorDialogComponent);

    dialogRef.afterClosed().subscribe(d => {
      if (d) {
        d.end = d.end != -1 ? d.end : this._dataService.data.simulation.time;
        d.max = d.max != -1 ? d.max : this._dataService.data.simulation.time;
        d.toFixed = this._dataService.data.kernel.resolution >= 1 ? -1 : String(this._dataService.data.kernel.resolution).split('.')[1].length;
        var array = this._generatorService.generate(d);
        this.data[this.id] = array;
        this._simulationService.run()
      }
    });
  }

}
