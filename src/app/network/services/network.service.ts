import { Injectable, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  public update: EventEmitter<any> = new EventEmitter();
  public quickView: boolean = false;

  constructor(
    private snackBar: MatSnackBar,
  ) { }


}
