import { Component, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';

import { MatMenuTrigger } from '@angular/material/menu';

import { NetworkConfigService } from '../../network-config/network-config.service';
import { NetworkService } from '../../services/network.service';

import { Connection } from '../../../components/connection';
import { Model } from '../../../components/model';
import { Network } from '../../../components/network';
import { Node } from '../../../components/node';
import { Parameter } from '../../../components/parameter';


@Component({
  selector: 'app-node-controller',
  templateUrl: './node-controller.component.html',
  styleUrls: ['./node-controller.component.scss'],
})
export class NodeControllerComponent implements OnInit, OnDestroy {
  @Input() node: Node;
  private subscription: any;
  public recordables: string[] = [];

  constructor(
    private _networkService: NetworkService,
    public _networkConfigService: NetworkConfigService,
  ) {
  }

  ngOnInit() {
    // console.log('Init node controller')
    this.subscription = this._networkService.update.subscribe((network: Network) => this.update())
    this.update()
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  update(): void {
    if (this.node.model.existing !== 'multimeter') return
    this.recordables = this.recordables;
  }

}
