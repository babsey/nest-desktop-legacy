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

  hasConnectomeProperty(key: string): boolean {
    let connectome = this.data.simulation.connectomes[this.link.idx];
    return connectome.hasOwnProperty(key);
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
    var source = this.color('source');
    var target = this.color('target');
    var gradient = ['150deg', source, source, bg, bg, target, target].join(', ');
    return 'linear-gradient(' + gradient + ')';
  }

  resetParameters(): void {
    let connectome = this.data.simulation.connectomes[this.link.idx];
    if (this.hasConnectomeProperty('projections')) {
      var projections = this.connectome.projections;
      projections.weights = 1;
      projections.delays = 1;
      projections.kernel = 1;
      projections.connection_type = 'convergent';
      delete projections.number_of_connections;
      delete projections.mask;
    } else {
      delete connectome['src_idx'];
      delete connectome['tgt_idx'];
      connectome.conn_spec.rule = 'all_to_all';
      connectome.syn_spec.model = 'static_synapse';
      connectome.syn_spec.weight = 1;
      connectome.syn_spec.delay = 1;
    }
    this.dataChange.emit(this.data)
  }

  customSources(): void {
    let connectome = this.data.simulation.connectomes[this.link.idx];
    connectome.conn_spec.rule = 'all_to_all';
    connectome['src_idx'] = [];
  }

  allSources(): void {
    let connectome = this.data.simulation.connectomes[this.link.idx];
    delete connectome['src_idx'];
  }

  customTargets(): void {
    let connectome = this.data.simulation.connectomes[this.link.idx];
    connectome.conn_spec.rule = 'all_to_all';
    connectome['tgt_idx'] = [];
  }

  allTargets(): void {
    let connectome = this.data.simulation.connectomes[this.link.idx];
    delete connectome['tgt_idx'];
  }

  deleteLink(): void {
    this.data.simulation.connectomes = this.data.simulation.connectomes.filter((connectome, idx) => idx != this.link.idx);
    this.data.app.links = this.data.app.links.filter(link => link.idx != this.link.idx);
    this.data.app.links.forEach((link, idx) => link.idx = idx)
    this.dataChange.emit(this.data)
  }

}
