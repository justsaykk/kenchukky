import { Injectable, OnDestroy } from '@angular/core';
import { Messaging, getMessaging, getToken, onMessage } from "firebase/messaging"
import { FirebaseAuthenticationService } from './firebase-authentication.service';
import { environment } from 'src/environments/environment';
import { User } from '@angular/fire/auth';
import { BehaviorSubject, Subscription } from 'rxjs';
import { BackendService } from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnDestroy{

  messaging!: Messaging
  user!: User | null
  user$!: Subscription
  private message = new BehaviorSubject<string>("");


  constructor(
    private authSvc: FirebaseAuthenticationService,
    private backendSvc: BackendService,
  ) { 
    this.messaging = getMessaging()
    // Handle foreground notification
    onMessage(this.messaging, (payload) => {
      let body = payload.notification?.body;
      body ? this.message.next(body) : this.message.next("");
      }
    );
    this.user$ = this.authSvc.user$.subscribe((user) => this.user = user)
  }

  async fbGenerateToken() {
    const currentToken = await getToken(this.messaging, { vapidKey: environment.firebase.vapidKey})
    if (currentToken && this.user?.uid) {
      // Get redis to store {uid: token} information
      this.backendSvc.storeNotificationToken(currentToken, this.user.uid)
    }
  }

  ngOnDestroy(): void {
      this.user$.unsubscribe();
  }

}
