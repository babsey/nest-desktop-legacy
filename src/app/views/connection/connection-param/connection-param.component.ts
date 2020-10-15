import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';

import { Connection } from '../../../components/connection/connection';
import { Parameter } from '../../../components/parameter';

import { ModelConfigDialogComponent } from '../../model/model-config-dialog/model-config-dialog.component';


@Component({
  selector: 'app-connection-param',
  templateUrl: './connection-param.component.html',
  styleUrls: ['./connection-param.component.scss']
})
export class ConnectionParamComponent implements OnInit {
  @Input() connection: Connection;
  @Input() options: any;
  @Input() random = true;
  @Input() value: any;
  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
  private _contextMenuPosition = { x: '0px', y: '0px' };

  constructor(
    private _dialog: MatDialog,
  ) { }

  ngOnInit() {
  }

  get contextMenuPosition(): any {
    return this._contextMenuPosition;
  }

  setDefaultValue(): void {
    this.value = Number(this.options.value);
    this.valueChange.emit(this.value);
  }

  addFactor(): void {
    const param: Parameter = this.connection.synapse.params.find((p: Parameter) => p.id === this.options.id);
    if (param) {
      param.factors.push('g');
    }
  }

  setRandom(): void {
    this.value = { parametertype: 'constant', specs: { value: this.value } };
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
    this._contextMenuPosition.x = event.clientX + 'px';
    this._contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.openMenu();
  }

}
