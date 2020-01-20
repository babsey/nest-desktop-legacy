import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { AppConfigService } from '../../config/app-config/app-config.service';

import { Data } from '../../classes/data';

import { enterAnimation } from '../../animations/enter-animation';


@Component({
  selector: 'app-simulation-details',
  templateUrl: './simulation-details.component.html',
  styleUrls: ['./simulation-details.component.scss'],
  animations: [ enterAnimation ],
})
export class SimulationDetailsComponent implements OnInit {
  @Input() data: Data;
  @Output() dataChange: EventEmitter<any> = new EventEmitter();

  constructor(
    private _appConfigService: AppConfigService,
  ) { }

  ngOnInit(): void {
  }

  advanced(): boolean {
    return this._appConfigService.config['app'].advanced;
  }

  onDataChange(data: Data): void {
    this.dataChange.emit(this.data)
  }

}
