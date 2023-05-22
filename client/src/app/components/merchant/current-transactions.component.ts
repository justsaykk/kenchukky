import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { VerifyTxnDialogComponent } from './verify-txn-dialog.component';
import { Order } from 'src/app/models/models';
import { MerchantService } from 'src/app/services/merchant.service';

@Component({
  selector: 'app-current-transactions',
  templateUrl: './current-transactions.component.html',
  styleUrls: ['./current-transactions.component.css'],
})
export class CurrentTransactionsComponent implements OnInit {
  // TODO: fetch list of orders from server on init
  merchantId: string = 'abcdef';
  recentOrders: Order[] = [];

  constructor(
    private dialog: MatDialog,
    private merchantService: MerchantService
  ) {}

  ngOnInit(): void {
    this.merchantService
      .getRecentOrders(this.merchantId)
      .then((res) => (this.recentOrders = res))
      .catch((err) => console.error(err));
  }

  // TODO: display popup when receive notification from firebase of new incoming order
  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.data = {
      orderId: 126,
      customerId: '123',
      customerName: 'chukkie',
      timeOfOrder: '2023-05-22 21:34:00.0',
      qty: 2,
      uom: 'container(s)',
    };

    const dialogRef = this.dialog.open(VerifyTxnDialogComponent, dialogConfig);

    // TODO: send notification of orders status to customer after cancel or confirmation
    dialogRef.afterClosed().subscribe((order) => {
      console.log('The dialog was closed');
      if (!!order) this.recentOrders = [order, ...this.recentOrders];
    });
  }
}
