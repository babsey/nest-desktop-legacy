import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core'

import { ChartService } from './chart/chart.service';
import { NavigationService } from './navigation/navigation.service';
import { ControllerService } from './controller/controller.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('content') content: any;
  public buttonDisplay: any = '0.2';

  constructor(
    private _chartService: ChartService,
    private _navigationService: NavigationService,
    private _controllerService: ControllerService,
  ) {
  }

  ngOnInit() {

  }

  toggleNav() {
    this.buttonDisplay = '0.2';
    this._navigationService.options.sidenavOpened = !this._navigationService.options.sidenavOpened;
  }

  isOpened() {
    return this._navigationService.options.sidenavOpened;
  }

  onClose() {
    this._navigationService.options.sidenavOpened = false;
  }

  onChange() {
    var width = this.content.elementRef.nativeElement.clientWidth - (this._controllerService.options.sidenavOpened ? 380 : 0);
    var height = this.content.elementRef.nativeElement.clientHeight;
    this._chartService.resize(width, height);
  }




}
