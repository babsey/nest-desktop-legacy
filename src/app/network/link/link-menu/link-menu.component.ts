import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ColorService } from '../../services/color.service';

import { Data } from '../../../classes/data';
import { AppLink } from '../../../classes/appLink';
import { SimConnectome } from '../../../classes/simConnectome';


@Component({
  selector: 'app-link-menu',
  templateUrl: './link-menu.component.html',
  styleUrls: ['./link-menu.component.scss']
})
export class LinkMenuComponent implements OnInit {
  @Input() data: Data;
  @Input() link: AppLink;
  @Output() dataChange: EventEmitter<any> = new EventEmitter();
  public connectome: SimConnectome;

  constructor(
    private _colorService: ColorService,
  ) { }

  ngOnInit() {
  }

  color(node: string): string {
    if (!this.link) return 'black';
    let nodes = this.data.app.nodes;
    let connectome = this.data.simulation.connectomes[this.link.idx];
    if (!connectome) return 'black';
    return this._colorService.node(nodes[connectome[node]])
  }

  backgroundImage(): string {
    if (!this.link) return
    var bg = '#fafafa';
    var pre = this.color('pre');
    var post = this.color('post');
    var gradient = ['150deg', pre, pre, bg, bg, post, post].join(', ');
    return 'linear-gradient(' + gradient + ')';
  }

  resetParameters(): void {
    let connectome = this.data.simulation.connectomes[this.link.idx];
    if (connectome.hasOwnProperty('projections')) {
      var projections = this.connectome.projections;
      projections.weights = 1;
      projections.delays = 1;
      projections.kernel = 1;
      projections.connection_type = 'convergent';
      delete projections.number_of_connections;
      delete projections.mask;
    } else {
      connectome.conn_spec.rule = 'all_to_all';
      connectome.syn_spec.model = 'static_synapse';
      connectome.syn_spec.weight = 1;
      connectome.syn_spec.delay = 1;
    }
    this.dataChange.emit(this.data)
  }

  deleteLink(): void {
    this.data.simulation.connectomes = this.data.simulation.connectomes.filter((connectome, idx) => idx != this.link.idx);
    this.data.app.links = this.data.app.links.filter(link => link.idx != this.link.idx);
    this.data.app.links.forEach((link, idx) => link.idx = idx)
    this.dataChange.emit(this.data)
  }

}
