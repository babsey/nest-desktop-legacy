import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public rightClick: boolean = false;

  constructor() { }
}
