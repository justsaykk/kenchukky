import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { VerifyTxnDialogComponent } from './verify-txn-dialog.component';
import { orderNotification, Order } from 'src/app/models/models';
import { MerchantService } from 'src/app/services/merchant.service';
import { filter, take } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { getMessaging, onMessage } from 'firebase/messaging';
import { FirebaseAuthenticationService } from 'src/app/services/firebase-authentication.service';
import { QrcodeComponent } from './qrcode.component';

@Component({
  selector: 'app-current-transactions',
  templateUrl: './current-transactions.component.html',
  styleUrls: ['./current-transactions.component.css'],
})
export class CurrentTransactionsComponent implements OnInit {
  // TODO: fetch list of orders from server on init
  merchantId!: string;
  recentOrders: Order[] = [];

  constructor(
    private dialog: MatDialog,
    private authSvc: FirebaseAuthenticationService,
    private merchantService: MerchantService,
    private notificationSvc: NotificationService
  ) {
  }
  
  async ngOnInit(): Promise<void> {
    // generate firebase token
    this.notificationSvc.fbGenerateToken();
    await this.authSvc.user$.pipe(take(1), filter(user => null != user)).forEach((user) => this.merchantId = user?.uid!)

    // get order list
    if (this.merchantId) {
      this.getOrders();
    }

    // subscribe to notificaitons
    this.listen();
  }

  getOrders() {
    console.log('>>> getting merchant orders');
    this.merchantService
      .getRecentOrders(this.merchantId)
      .then((res) => {
        console.log(res);
        this.recentOrders = res;
      })
      .catch((err) => console.error(err));
  }

  // TODO: display popup when receive notification from firebase of new incoming order
  openDialog(orderNotification: orderNotification): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.data = orderNotification;

    const dialogRef = this.dialog.open(VerifyTxnDialogComponent, dialogConfig);

    // TODO: send notification of orders status to customer after cancel or confirmation
    dialogRef.afterClosed().subscribe((order) => {
      console.log('The dialog was closed');
      this.merchantService.sendOrderConfirmation({
        orderId: orderNotification.orderId,
        merchantId: this.merchantId,
        isConfirmed: !!order,
      });

      // refresh order list

      setTimeout(
        () =>
          this.merchantService
            .getRecentOrders('abcdef')
            .then((res) => {
              console.log(res);
              this.recentOrders = res;
            })
            .catch((err) => console.error(err)),
        3000
      );
    });
  }

  listen() {
    const messaging = getMessaging();
    console.info('Listening for notification');
    onMessage(messaging, (payload) => {
      console.log('received notification');
      console.table(payload.notification?.body);
      if (!!payload.notification?.body) {
        const orderNotification = JSON.parse(payload.notification.body);
        console.table(orderNotification);
        this.openDialog(orderNotification);
      }
    });
  }

  openQrCode() {
    this.dialog.open(QrcodeComponent, {
      data: {
        merchantId: this.merchantId
      }
    });

  }
}
