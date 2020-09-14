import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';

import { Connection } from '../../../components/connection/connection';

import { ModelConfigDialogComponent } from '../../model/model-config-dialog/model-config-dialog.component';


@Component({
  selector: 'app-connection-param',
  templateUrl: './connection-param.component.html',
  styleUrls: ['./connection-param.component.scss']
})
export class ConnectionParamComponent implements OnInit {
  @Input() connection: Connection;
  @Input() random: boolean = true;
  @Input() options: any;
  @Input() value: any;
  @Output() valueChange: EventEmitter<any> = new EventEmitter();

  @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  constructor(
    private _dialog: MatDialog,
  ) { }

  ngOnInit() {
  }

  setDefaultValue(): void {
    this.value = Number(this.options.value);
    this.valueChange.emit(this.value);
  }

  addFactor(): void {
    const param = this.connection.synapse['params'].find(param => param.id === this.options.id);
    if (param) {
      param['factors'].push('g');
    }
  }

  setRandom(): void {
    this.value = { parameterType: 'constant', specs: { value: this.value } };
  }

  isNumber(): boolean {
    return typeof this.value === 'number';
  }

  onFactorClick(factor): void {
    console.log(factor);
  }

  onValueChange(value: any): void {
    this.valueChange.emit(value);
  }

  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.openMenu();
  }

}
