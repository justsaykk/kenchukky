import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseUISignInFailure, FirebaseUISignInSuccessWithAuthResult, FirebaseuiAngularLibraryService } from 'firebaseui-angular';
import { Subscription, filter, take } from 'rxjs';
import { UserDataWithRole } from 'src/app/models/models';
import { FirebaseAuthenticationService } from 'src/app/services/firebase-authentication.service';
import { FirebaseFirestoreService } from 'src/app/services/firebase-firestore.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy, OnInit{
  loginForm!: FormGroup;
  authState$!: Subscription;
  authState!: User | null;

  constructor(
    private firebaseuiAngularLibraryService: FirebaseuiAngularLibraryService,
    private router: Router,
    private afs: FirebaseFirestoreService,
    private authSvc: FirebaseAuthenticationService,
    private location: Location,
    private fb: FormBuilder 
  ) {
    this.firebaseuiAngularLibraryService.firebaseUiInstance.disableAutoSignIn();
    this.authState$ = this.authSvc.authState$.subscribe((state: User | null) => this.authState = state);
  }
  
  ngOnInit(): void {
    if (null == this.authState) {
      this.createForm();
    }
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: this.fb.control('', [Validators.email, Validators.required]),
      password: this.fb.control('', [Validators.required])
    })
  }

  async login() {
    const loginData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    }
    await this.authSvc.firebaseLogin(loginData)
  }

  // Code for firebaseAuth UI
  successCallback(signInSuccessData: FirebaseUISignInSuccessWithAuthResult){
    console.log(signInSuccessData)
   }
    
  errorCallback(errorData: FirebaseUISignInFailure){
    console.log(errorData)
   }
  
  uiShownCallback() {
    console.log("UI is shown")
   }
  
  // Back Button
  goBack(): void {this.location.back()}

  ngOnDestroy(): void {
    this.authState$.unsubscribe()
  }
}
