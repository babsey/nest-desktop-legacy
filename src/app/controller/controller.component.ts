import { Component, Input, OnInit } from '@angular/core';

import {
  faChessPawn,
  faChessKnight,
  faChessRook,
  faChessQueen,
  faEllipsisV,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';


import { ConfigService } from '../config/config.service';
import { ControllerService } from './controller.service';
import { DataService } from '../services/data/data.service';


@Component({
  selector: 'app-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.css'],
})
export class ControllerComponent implements OnInit {
  public faChessPawn = faChessPawn;
  public faChessKnight = faChessKnight;
  public faChessRook = faChessRook;
  public faChessQueen = faChessQueen;
  public faEllipsisV = faEllipsisV;
  public faCheck = faCheck;

  constructor(
    public _configService: ConfigService,
    public _controllerService: ControllerService,
    public _dataService: DataService,
  ) { }

  ngOnInit() {
  }

  setLevel(level) {
    this._configService.config.app.controller.level = level;
    this._configService.save('app', this._configService.config.app)
  }

  getLevel() {
    let level = this._configService.config.app.controller.level;
    return level;
  }

  isLevel(level) {
    return this._configService.config.app.controller.level == level;
  }

}
