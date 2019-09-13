import { Component, OnInit } from '@angular/core';

import { MatDialogRef } from '@angular/material';

import { GeneratorService } from '../../services/generator/generator.service';


@Component({
  selector: 'app-array-generator-dialog',
  templateUrl: './array-generator-dialog.component.html',
  styleUrls: ['./array-generator-dialog.component.scss']
})
export class ArrayGeneratorDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ArrayGeneratorDialogComponent>,
    public _generatorService: GeneratorService,
  ) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
