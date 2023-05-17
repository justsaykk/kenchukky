import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Component } from '@angular/core';
import { VerifyTxnDialogComponent } from './verify-txn-dialog.component';

@Component({
  selector: 'app-current-transactions',
  templateUrl: './current-transactions.component.html',
  styleUrls: ['./current-transactions.component.css'],
})
export class CurrentTransactionsComponent {
  constructor(private dialog: MatDialog) {}

  // TODO: after close component, add confirmed txn to list
  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      orderId: 123,
      customerName: 'kenny',
      qty: 2,
      uom: 'container(s)',
    };

    this.dialog.open(VerifyTxnDialogComponent, dialogConfig);
  }
}
