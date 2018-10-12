import {FlatTreeControl} from '@angular/cdk/tree';
import { Component, Injectable, Input, OnInit, OnChanges } from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject, Observable, of as observableOf} from 'rxjs';

import { faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { DataService } from '../shared/services/data/data.service'

@Injectable()
export class Database {
  dataChange = new BehaviorSubject<any[]>([]);

  get data(): any[] { return this.dataChange.value; }

  constructor() {
  }

  initialize(dataObject) {
    const data = this.buildTree(dataObject, 0);
    this.dataChange.next(data);
  }

  buildTree(obj: object, level: number): any[] {
    return Object.keys(obj).reduce<any[]>((accumulator, key) => {
      const value = obj[key];
      const node = {};
      node['key'] = key;

      if (value != null) {
        if (typeof value === 'object') {
          node['children'] = this.buildTree(value, level + 1);
        } else {
          node['value'] = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }
}

@Component({
  selector: 'app-tree-view',
  templateUrl: 'tree-view.component.html',
  styleUrls: ['tree-view.component.css'],
  providers: [Database]
})
export class TreeViewComponent implements OnInit, OnChanges {
  @Input() data;
  treeControl: FlatTreeControl<any>;
  treeFlattener: MatTreeFlattener<any, any>;
  dataSource: MatTreeFlatDataSource<any, any>;

  public faChevronRight = faChevronRight;
  public faChevronDown = faChevronDown;

  constructor(private database: Database) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel,
      this._isExpandable, this._getChildren);
    this.treeControl = new FlatTreeControl<any>(this._getLevel, this._isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    database.dataChange.subscribe(data => this.dataSource.data = data);

  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.database.initialize(this.data)
    this.treeControl.expandAll()
  }

  transformer = (node: any, level: number) => {
    return {
      expandable: !!node.children,
      disabled: node.children ? node.children.length == 0 : true,
      key: node.key,
      level: level,
      value: node.value
    }
  }

  private _getLevel = (node: any) => node.level;

  private _isExpandable = (node: any) => node.expandable;

  private _getChildren = (node: any): Observable<any[]> => observableOf(node.children);

  expandable = (_: number, _nodeData: any) => {
    return _nodeData.expandable
  };

}
