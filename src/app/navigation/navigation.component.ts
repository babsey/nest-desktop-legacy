import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MdePopoverTrigger } from '@material-extended/mde';
import { MatBottomSheet } from '@angular/material';
import { Router } from '@angular/router';

import { AppConfigService } from '../config/app-config/app-config.service'
import { NavigationService } from './navigation.service';



@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  constructor(
    public _appConfigService: AppConfigService,
    public _navigationService: NavigationService,
    public router: Router,
  ) {
  }

  ngOnInit() {
  }

}
