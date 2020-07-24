import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { MatMenuTrigger } from '@angular/material/menu';

import { AppService } from '../../../app.service';
import { ModelService } from '../../../model/model.service';
import { NetworkService } from '../../services/network.service';

import { Project } from '../../../components/project';
import { Model } from '../../../components/model';
import { Node } from '../../../components/node';


@Component({
  selector: 'app-node-toolbar',
  templateUrl: './node-toolbar.component.html',
  styleUrls: ['./node-toolbar.component.scss']
})
export class NodeToolbarComponent implements OnInit {
  @Input() node: Node;
  @Input() disabled: boolean = false;
  public models: Model[] = [];

  @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
  public contextMenuPosition = { x: '0px', y: '0px' };

  constructor(
    private _appService: AppService,
    private _networkService: NetworkService,
  ) { }

  ngOnInit() {
    this.models = this.node.models;
  }

  selectModel(event: any): void {
    // this._networkService.update.emit(this.node.network)
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

}
