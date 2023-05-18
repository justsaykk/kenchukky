import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {firebase, firebaseui, FirebaseUIModule} from 'firebaseui-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { PointsHistoryComponent } from './components/points-history.component';
import { NavbarComponent } from './components/navbar.component';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore'
import { LoginComponent } from './pages/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { QrcodeComponent } from './components/qrcode/qrcode.component';
import { QRCodeModule } from 'angularx-qrcode';
import { AnimationComponent } from './components/animation.component';

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  ],
  tosUrl: '<your-tos-link>',
  privacyPolicyUrl: '<your-privacyPolicyUrl-link>',
  credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO
}

@NgModule({
  declarations: [
    AppComponent,
    AnimationComponent,
    HomeComponent,
    PointsHistoryComponent,
    NavbarComponent,
    LoginComponent,
    SignUpComponent,
    QrcodeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    // Firebase Imports
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    AngularFireModule.initializeApp(environment.firebase), // Added so that FirebaseUIModule will work.
    // QR Code
    QRCodeModule,
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
