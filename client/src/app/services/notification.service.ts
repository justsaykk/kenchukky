import { Injectable, OnDestroy } from '@angular/core';
import {
  Messaging,
  getMessaging,
  getToken,
  onMessage,
} from 'firebase/messaging';
import { FirebaseAuthenticationService } from './firebase-authentication.service';
import { environment } from 'src/environments/environment';
import { User } from '@angular/fire/auth';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { BackendService } from './backend.service';
import { orderNotification, Order } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class NotificationService implements OnDestroy {
  messaging!: Messaging;
  user!: User | null;
  user$!: Subscription;
  private _message = new BehaviorSubject<string>('');
  private _notificationData = new BehaviorSubject<orderNotification>({
    senderToken: null,
    orderId: null,
    customerName: null,
    timeOfOrder: null,
    qty: null,
    uom: null,
  });

  constructor(
    private authSvc: FirebaseAuthenticationService,
    private backendSvc: BackendService
  ) {
    this.messaging = getMessaging();
    onMessage(this.messaging, (payload) => {
      console.log(payload);

      let body = payload.notification?.body!;
      if (payload.data) {
        let data = payload.data;
        let notificationData: orderNotification = {
          senderToken: data['senderToken'],
          orderId: data['orderId'],
          customerName: data['customerName'],
          timeOfOrder: data['timeOfOrder'],
          qty: parseInt(data['qty']),
          uom: data['uom'],
        };
        this._notificationData.next(notificationData);
      }
      this._message.next(body);
    });
    this.user$ = this.authSvc.user$.subscribe((user) => (this.user = user));
  }

  public getMessage(): Observable<string> {
    return this._message.asObservable();
  }
  public getnotificationData(): Observable<orderNotification> {
    console.log('>>> svc received notification');
    return this._notificationData.asObservable();
  }

  async fbGenerateToken() {
    const currentToken = await getToken(this.messaging, {
      vapidKey: environment.firebase.vapidKey,
    });
    console.log('>>> merchantFbToken: ' + currentToken);
    if (currentToken && this.user?.uid) {
      // Get redis to store {uid: token} information
      this.backendSvc.storeNotificationToken(currentToken, this.user.uid);
    }
  }

  ngOnDestroy(): void {
    this.user$.unsubscribe();
  }
}
