import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core'

import { ChartService } from './chart/chart.service';
import { NavigationService } from './navigation/navigation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('content') content: any;

  constructor(
    private _chartService: ChartService,
    private _navigationService: NavigationService,
  ) {
  }

  ngOnInit() {
  }

  isOpened() {
    return this._navigationService.options.sidenavListOpened;
  }

  onClose() {
    this._navigationService.options.sidenavListOpened = false;
  }

  onChange() {
    var width = this.content.elementRef.nativeElement.clientWidth - 380;
    var height = this.content.elementRef.nativeElement.clientHeight;
    this._chartService.resize(width, height);
  }


}
