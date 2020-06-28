import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { MatMenuTrigger } from '@angular/material/menu';

import { AppConfigService } from '../../../config/app-config/app-config.service';
import { AppService } from '../../../app.service';
import { ColorService } from '../../services/color.service';
import { ModelService } from '../../../model/model.service';
import { NetworkConfigService } from '../../network-config/network-config.service';
import { NetworkControllerService } from '../../network-controller/network-controller.service';
import { NetworkService } from '../../services/network.service';

import { Data } from '../../../classes/data';
import { AppNode } from '../../../classes/appNode';
import { AppLink } from '../../../classes/appLink';
import { SimCollection } from '../../../classes/simCollection';
import { SimConnectome } from '../../../classes/simConnectome';


@Component({
  selector: 'app-link-toolbar',
  templateUrl: './link-toolbar.component.html',
  styleUrls: ['./link-toolbar.component.scss']
})
export class LinkToolbarComponent implements OnInit {
  @Input() data: Data;
  @Input() link: AppLink;
  @Output() dataChange: EventEmitter<any> = new EventEmitter();
  @Output() nodeClick: EventEmitter<any> = new EventEmitter();
  public connectome: SimConnectome;

  @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  constructor(
    private _appService: AppService,
    private _appConfigService: AppConfigService,
    private _colorService: ColorService,
    private _modelService: ModelService,
    private _networkConfigService: NetworkConfigService,
    private _networkControllerService: NetworkControllerService,
    private _networkService: NetworkService,
  ) { }

  ngOnInit(): void {
    this.connectome = this.data.simulation.connectomes[this.link.idx];
  }

  backgroundImage(): string {
    var bg = '#fafafa';
    var source = this.color('source');
    var target = this.color('target');
    var gradient = ['150deg', source, source, bg, bg, target, target].join(', ');
    return 'linear-gradient(' + gradient + ')';
  }

  label(idx: number): string {
    return this.collection(idx).model.split('-')[1]
  }

  collection(idx: number): SimCollection {
    return this.data.simulation.collections[idx];
  }

  color(src: string): string {
    return this._colorService.node(this.connectome[src]);
  }

  color_weight(): string {
    return this._colorService.connectome(this.connectome);
  }

  source(): AppNode {
    return this.data.app.nodes[this.connectome.source];
  }

  target(): AppNode {
    return this.data.app.nodes[this.connectome.target];
  }

  isSpatial(idx: number): boolean {
    var collection = this.collection(idx);
    return collection.isSpatial();
  }

  selectNode(idx: number): void {
    var node = this.data.app.nodes[idx];
    var elementType = this.data.simulation.collections[idx].element_type;
    this._networkService.selectNode(node, elementType);
  }

  selectLink(): void {
    this._networkService.selectLink(this.link)
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
