import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-network-clear-dialog',
  templateUrl: './network-clear-dialog.component.html',
  styleUrls: ['./network-clear-dialog.component.scss']
})
export class NetworkClearDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<NetworkClearDialogComponent>,
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
