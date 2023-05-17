import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseUISignInFailure, FirebaseUISignInSuccessWithAuthResult, FirebaseuiAngularLibraryService } from 'firebaseui-angular';
import { Subscription } from 'rxjs';
import { FirebaseAuthenticationService } from 'src/app/services/firebase-authentication.service';

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
    console.log(`user: ${this.authState?.displayName} is logged in.`)
  }

  // Code for firebaseAuth UI
  successCallback(signInSuccessData: FirebaseUISignInSuccessWithAuthResult){
    console.log(signInSuccessData)
    this.router.navigate(["/"]);
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
