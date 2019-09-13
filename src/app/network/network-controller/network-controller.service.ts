import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NetworkControllerService {
  public selected: any = null;
  public selection: boolean = false;
  public elementType = null;

  constructor() { }
}
