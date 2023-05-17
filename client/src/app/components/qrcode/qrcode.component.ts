import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '@angular/fire/auth';
import { FirebaseAuthenticationService } from 'src/app/services/firebase-authentication.service';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css']
})
export class QrcodeComponent implements OnInit, OnDestroy{
  currentUser$!: Subscription
  currentUser!: User | null

  constructor(
    private authenticationSvc: FirebaseAuthenticationService
  ) {
    this.currentUser$ = this.authenticationSvc.user$.subscribe((user: User | null) => this.currentUser = user)
  }

  ngOnInit(): void {
      
  }

  ngOnDestroy(): void {
    this.currentUser$.unsubscribe();
  }

}
