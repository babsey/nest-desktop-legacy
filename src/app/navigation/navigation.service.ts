import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  public options: any = {
    sidenavOpened: true,
  };

  constructor(
  ) { }
}
