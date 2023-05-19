import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Component } from '@angular/core';
import { VerifyTxnDialogComponent } from './verify-txn-dialog.component';
import { Transaction } from 'src/app/models/models';

@Component({
  selector: 'app-current-transactions',
  templateUrl: './current-transactions.component.html',
  styleUrls: ['./current-transactions.component.css'],
})
export class CurrentTransactionsComponent {
  recentTxns: Transaction[] = [
    {
      orderId: 125,
      customerName: 'kenken',
      qty: 1,
      uom: 'container(s)',
    },
    {
      orderId: 124,
      customerName: 'test',
      qty: 3,
      uom: 'cups(s)',
    },
    {
      orderId: 123,
      customerName: 'ken',
      qty: 2,
      uom: 'container(s)',
    },
  ];

  constructor(private dialog: MatDialog) {}

  // TODO: after close component, add confirmed txn to list
  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.data = {
      orderId: 126,
      customerName: 'chukkie',
      qty: 2,
      uom: 'container(s)',
    };

    const dialogRef = this.dialog.open(VerifyTxnDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((txn) => {
      console.log('The dialog was closed');
      if (!!txn) this.recentTxns = [txn, ...this.recentTxns];
    });
  }
}
