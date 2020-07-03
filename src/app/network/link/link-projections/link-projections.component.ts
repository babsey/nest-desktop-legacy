import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { NetworkConfigService } from '../../network-config/network-config.service';

import { AppConnection } from '../../../classes/appConnection';
import { SimConnection } from '../../../classes/simConnection';


@Component({
  selector: 'app-link-projections',
  templateUrl: './link-projections.component.html',
  styleUrls: ['./link-projections.component.scss']
})
export class LinkProjectionsComponent implements OnInit {
  @Input() link: AppConnection;
  @Input() connectome: SimConnection;
  @Output() connectomeChange: EventEmitter<any> = new EventEmitter();
  public config: any;

  constructor(
    private _networkConfigService: NetworkConfigService,
  ) { }

  ngOnInit(): void {
    this.config = this._networkConfigService.config.projections;
  }

  onValueChange(value: any): void {
    this.connectomeChange.emit(this.connectome)
  }

  onProjectionsChange(projections: any): void {
    this.connectomeChange.emit(this.connectome)
  }

  onSelectConnectionType(value: any): void {
    this.connectomeChange.emit(this.connectome)
  }

  onSelectionChange(event: any): void {
    this.connectome.projections[event.option.value] = event.option.selected;
    this.connectomeChange.emit(this.connectome)
  }

}
