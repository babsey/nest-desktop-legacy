import { Component, Input, OnInit } from '@angular/core';

import {
  faChessPawn,
  faChessKnight,
  faChessRook,
  faChessQueen,
  faSlidersH,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';

import { ConfigService } from '../shared/services/config/config.service';
import { DataService } from '../shared/services/data/data.service';


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
  public faSlidersH = faSlidersH;
  public faCheck = faCheck;

  constructor(
    public _configService: ConfigService,
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

}
