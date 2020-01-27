import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  public sidenavShortView: boolean = false;
  public sidenavOpened: boolean = false;

  constructor(
  ) { }
}
