import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-verify-txn-dialog',
  templateUrl: './verify-txn-dialog.component.html',
  styleUrls: ['./verify-txn-dialog.component.css'],
})
export class VerifyTxnDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<VerifyTxnDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VerifyTxnDialogModel
  ) {}

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
