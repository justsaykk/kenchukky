import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { VerifyTxnDialogComponent } from './verify-txn-dialog.component';
import { NotificationData, Order } from 'src/app/models/models';
import { MerchantService } from 'src/app/services/merchant.service';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { getMessaging, onMessage } from 'firebase/messaging';

@Component({
  selector: 'app-current-transactions',
  templateUrl: './current-transactions.component.html',
  styleUrls: ['./current-transactions.component.css'],
})
export class CurrentTransactionsComponent implements OnInit, OnDestroy {
  // TODO: fetch list of orders from server on init
  merchantId: string = 'abcdef';
  recentOrders: Order[] = [];
  notification$!: Subscription;

  constructor(
    private dialog: MatDialog,
    private merchantService: MerchantService,
    private notificationSvc: NotificationService
  ) {}

  ngOnInit(): void {
    // generate firebase token
    this.notificationSvc.fbGenerateToken();

    // get order list
    this.getOrders();

    // subscribe to notificaitons
    this.listen();
    // this.notification$ = this.notificationSvc
    //   .getnotificationData()
    //   .subscribe((orderNotification: NotificationData) => {
    //     // TODO: remove hardcoded data
    //     orderNotification = {
    //       senderToken: '123',
    //       orderId: '123',
    //       customerName: 'customer 1',
    //       timeOfOrder: '2023-05-12 23:43',
    //       qty: 2,
    //       uom: 'containers',
    //     };

    //     console.log('>>> received notification');

    //     if (!!orderNotification.orderId) {
    //       console.log(orderNotification);
    //       this.openDialog(orderNotification);
    //     }
    //   });
  }

  getOrders() {
    this.merchantService
      .getRecentOrders(this.merchantId)
      .then((res) => (this.recentOrders = res))
      .catch((err) => console.error(err));
  }

  ngOnDestroy(): void {
    this.notification$.unsubscribe();
  }

  // TODO: display popup when receive notification from firebase of new incoming order
  openDialog(orderNotification: NotificationData): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.data = orderNotification;

    const dialogRef = this.dialog.open(VerifyTxnDialogComponent, dialogConfig);

    // TODO: send notification of order status to customer after cancel or confirmation
    dialogRef.afterClosed().subscribe((order) => {
      console.log('The dialog was closed');
      // this.merchantService.sendOrderConfirmation({
      //   orderId: '123',
      //   merchantId: 'abcdef',
      //   isConfirmed: !!order,
      // });

      // refresh order list
      this.getOrders();
    });
  }

  listen() {
    const messaging = getMessaging();
    console.info('Listening for notification');
    onMessage(messaging, (payload) => {
      console.info('Messaged received', payload);
    });
  }
}
