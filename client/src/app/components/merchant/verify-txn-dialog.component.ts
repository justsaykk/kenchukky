import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { orderNotification } from 'src/app/models/models';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-verify-txn-dialog',
  templateUrl: './verify-txn-dialog.component.html',
  styleUrls: ['./verify-txn-dialog.component.css'],
})
export class VerifyTxnDialogComponent {
  ndata$!: Subscription;
  nData!: orderNotification;

  constructor(
    private dialogRef: MatDialogRef<VerifyTxnDialogComponent>,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: VerifyTxnDialogModel
  ) {
    this.ndata$ = this.notificationService
      .getnotificationData()
      .subscribe((data) => (this.nData = data));
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }
}

export class VerifyTxnDialogModel {
  constructor(
    public orderId: number,
    public customerName: string,
    public qty: number,
    public uom: string
  ) {}
}
