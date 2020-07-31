import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';

import { AppService } from '../../../services/app/app.service';
import { GeneratorService } from '../../../services/generator/generator.service';

import { ArrayGeneratorDialogComponent } from '../../forms/array-generator-dialog/array-generator-dialog.component';

import { ModelConfigDialogComponent } from '../model-config-dialog/model-config-dialog.component';


@Component({
  selector: 'app-model-param',
  templateUrl: './model-param.component.html',
  styleUrls: ['./model-param.component.scss']
})
export class ModelParamComponent implements OnInit {
  @Input() model: string;
  @Input() options: any;
  @Input() value: any;
  @Input() view: string;
  @Output() valueClick: EventEmitter<any> = new EventEmitter();
  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  @Output() paramHide: EventEmitter<any> = new EventEmitter();

  @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  constructor(
    private _appService: AppService,
    private _generatorService: GeneratorService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
  }

  setDefaultValue(): void {
    this.value = Number(this.options.value);
    this.valueChange.emit(this.value);
  }

  openConfigDialog(): void {
    if (this.options.id && this.model) {
      this.dialog.open(ModelConfigDialogComponent, {
        data: {
          param: this.options.id,
          model: this.model,
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
        this.value = this._generatorService.generate(d);
        this.valueChange.emit(this.value)
      }
    });
  }

  hideParam(param: string): void {
    this.paramHide.emit(param)
  }

  onValueChange(value: any): void {
    // console.log('Node param on value change')
    this.valueChange.emit(value) // Important to use value and not this.value
  }

  onValueClick(): void {
    this.valueClick.emit()
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
