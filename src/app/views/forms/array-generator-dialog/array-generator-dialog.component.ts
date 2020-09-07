import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { GeneratorService } from '../../../services/generator/generator.service';


@Component({
  selector: 'app-array-generator-dialog',
  templateUrl: './array-generator-dialog.component.html',
  styleUrls: ['./array-generator-dialog.component.scss']
})
export class ArrayGeneratorDialogComponent implements OnInit {

  constructor(
    private _dialogRef: MatDialogRef<ArrayGeneratorDialogComponent>,
    private _generatorService: GeneratorService,
  ) { }

  ngOnInit() {
  }

  get options(): any {
    return this._generatorService.options;
  }

  onNoClick(): void {
    this._dialogRef.close();
  }

}
