import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { firebase, firebaseui, FirebaseUIModule } from 'firebaseui-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/customer/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { PointsHistoryComponent } from './components/customer/points-history.component';
import { NavbarComponent } from './components/customer/navbar.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { LoginComponent } from './pages/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { QrcodeComponent } from './components/merchant/qrcode.component';
import { QRCodeModule } from 'angularx-qrcode';
import { CurrentTransactionsComponent } from './components/merchant/current-transactions.component';
import { VerifyTxnDialogComponent } from './components/merchant/verify-txn-dialog.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { QrscannerComponent } from './components/qrscanner/qrscanner.component';
import { AnimationComponent } from './components/animation.component';
import { HttpClientModule } from '@angular/common/http';
import { ScannerConfirmationComponent } from './components/customer/scanner-confirmation.component';
import { VoucherRedemptionComponent } from './components/customer/voucher-redemption.component';
import { NotificationService } from './services/notification.service';
import { DatePipe } from '@angular/common';

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  ],
  tosUrl: '<your-tos-link>',
  privacyPolicyUrl: '<your-privacyPolicyUrl-link>',
  credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
};

@NgModule({
  declarations: [
    AppComponent,
    AnimationComponent,
    HomeComponent,
    PointsHistoryComponent,
    NavbarComponent,
    LoginComponent,
    SignUpComponent,
    QrcodeComponent,
    CurrentTransactionsComponent,
    VerifyTxnDialogComponent,
    QrscannerComponent,
    ScannerConfirmationComponent,
    VoucherRedemptionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    // Firebase Imports
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    AngularFireModule.initializeApp(environment.firebase), // Added so that FirebaseUIModule will work.
    // QR Code
    QRCodeModule,
    // QR Scanner
    ZXingScannerModule,
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }, NotificationService, DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
