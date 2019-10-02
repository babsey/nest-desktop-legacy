import { Component, OnInit, OnChanges, Input, ElementRef, OnDestroy, Output, EventEmitter } from '@angular/core';

import * as d3 from 'd3';

import { ColorService } from '../../services/color.service';
import { DataService } from '../../../services/data/data.service';
import { NetworkService } from '../../services/network.service';
import { NetworkSketchService } from '../network-sketch.service';

import { Data } from '../../../classes/data';


@Component({
  selector: 'g[app-nodes-sketch]',
  templateUrl: 'nodes-sketch.component.html',
  styleUrls: ['./nodes-sketch.component.scss'],
})
export class NodesSketchComponent implements OnInit, OnChanges, OnDestroy {
  @Input() data: Data;
  @Input() width: number;
  @Input() height: number;
  @Output() linkChange: EventEmitter<any> = new EventEmitter();
  private host: any;
  private selector: any;
  private subscription: any;

  constructor(
    private _dataService: DataService,
    private _networkSketchService: NetworkSketchService,
    private elementRef: ElementRef,
    public _colorService: ColorService,
    public _networkService: NetworkService,
  ) {
    this.host = d3.select(elementRef.nativeElement.parentElement);
    this.selector = d3.select(elementRef.nativeElement);
  }

  ngOnInit() {
    // console.log('Init node sketch')
    this.subscription = this._networkSketchService.update.subscribe(() => {
      // console.log('Node sketch update emitted')
      this.update()
    })

    d3.select('body').on('keyup', () => {
      if (d3.event.keyCode == '27') {
        this.host.selectAll('.select').remove();
        this._networkService.resetMouseVars();
        this._networkSketchService.update.emit()
      }
    })
  }

  ngOnDestroy() {
    // console.log('Destroy node sketch')
    this.subscription.unsubscribe()
  }

  ngOnChanges() {
    // console.log('Change node sketch')
    this.update()
  }

  update() {
    // console.log('Update node sketch')
    if (this.data == undefined) return
    if (Object.keys(this.data).length === 0 && this.data.constructor === Object) return
    var nodes = this.selector.selectAll("g.node").data(this.data.app.nodes); // UPDATE
    nodes.on('mousedown.drag', null);
    nodes.call(this.dragHandler());
  }

  collection(idx: number) {
    return this.data.simulation.collections[idx];
  }

  connectome(link: any) {
    return this.data.simulation.connectomes[link.idx];
  }

  pre(link: any) {
    return this.connectome(link).pre;
  }

  post(link: any) {
    return this.connectome(link).post;
  }

  isSpatial(node: any) {
    var collection = this.data.simulation.collections[node.idx];
    return collection.hasOwnProperty('spatial')
  }

  connect(source: any, target: any) {
    // console.log('Connect', source.idx, target.idx)
    if (source != null) {
      var connectomes = this.data.simulation.connectomes;
      var checkLinks = this.data.app.links.filter(link => (this.pre(link) == source.idx && this.post(link) == source.idx));
      if (checkLinks.length == 0) {
        var newLink = {
          idx: this.data.app.links.length,
        };
        this.data.app.links.push(newLink)
        var newConnectome = this._dataService.newConnectome()
        newConnectome['pre'] = source.idx;
        newConnectome['post'] = target.idx;
        this.data.simulation.connectomes.push(newConnectome)
        this._dataService.validate(this.data)
        this.data['hash'] = this._dataService.hash(this.data['simulation']);
      }
      // console.log('Link change')
      this.linkChange.emit(this.data)
    }
  }

  dragHandler() {
    let r = this._networkSketchService.options.node.radius;

    return d3.drag()
      .on('drag', node => {
        if (this._networkSketchService.options.drawing) return
        if (d3.event.x < r || d3.event.x > this.width - r) return
        if (d3.event.y < r || d3.event.y > this.height - r) return
        node['position'].x = d3.event.x;
        node['position'].y = d3.event.y;
        this._networkSketchService.update.emit()
      }
    )
  }

  drawPath(node: any) {
    var source = this._networkService.selected.node;
    return this._networkSketchService.drawPath(source.position, node.position, true)
  }

  nodeRadius(node: any) {
    return this._networkSketchService.focused.node == node ? 18 : 15;
  }

  onClick(node: any) {
    // console.log('Click node')
    this.host.selectAll('.select').remove();
    if (this._networkSketchService.options.drawing) {
      var source = this._networkService.selected.node;
      this.connect(source, node);
    }
    this._networkService.selectNode(node);
    this._networkSketchService.update.emit()
  }

  onMouseOver(node: any) {
    this._networkSketchService.focused.node = node;
    if (!this._networkSketchService.options.drawing || !this._networkService.selected.node) return

    var dragline = this.host.select('.dragline');
    dragline.attr('d', this.drawPath(node))
  }

}
