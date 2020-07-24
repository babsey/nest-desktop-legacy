import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';

import { AppService } from '../../../app.service';
import { GeneratorService } from '../../../services/generator/generator.service';

import { ModelConfigDialogComponent } from '../../../model/model-config-dialog/model-config-dialog.component';
import { ArrayGeneratorDialogComponent } from '../../../forms/array-generator-dialog/array-generator-dialog.component';


@Component({
  selector: 'app-node-param',
  templateUrl: './node-param.component.html',
  styleUrls: ['./node-param.component.scss']
})
export class NodeParamComponent implements OnInit {
  @Input() param: any;

  @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  constructor(
    private _appService: AppService,
    private _generatorService: GeneratorService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
  }

  openConfigDialog(): void {
    if (this.param.id && this.param.parent.model) {
      this.dialog.open(ModelConfigDialogComponent, {
        data: {
          param: this.param.id,
          model: this.param.parent.model,
        }
      });
    }
  }

  openGeneratorDialog(): void {
    const dialogRef = this.dialog.open(ArrayGeneratorDialogComponent);
    dialogRef.afterClosed().subscribe(d => {
      if (d) {
        d.end = d.end != -1 ? d.end : 1000.;
        d.max = d.max != -1 ? d.max : 1000.;
        let resolution = 0.1;
        d.toFixed = resolution >= 1 ? -1 : String(resolution).split('.')[1].length;
        this.param.value = this._generatorService.generate(d);
      }
    });
  }

  onMouseOver(event: MouseEvent): void {
    this._appService.rightClick = true;
  }

  onMouseOut(event: MouseEvent): void {
    this._appService.rightClick = false;
  }

  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.openMenu();
  }

  onFactorClick(factor) {
    alert(factor)
  }

}
