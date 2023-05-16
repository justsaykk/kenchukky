import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseUISignInFailure, FirebaseUISignInSuccessWithAuthResult, FirebaseuiAngularLibraryService } from 'firebaseui-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private auth: Auth = inject(Auth)
  loginForm!: FormGroup;

  constructor(
    private firebaseuiAngularLibraryService: FirebaseuiAngularLibraryService,
    private router: Router,
    private location: Location,
    private fb: FormBuilder 
  ) {
    this.firebaseuiAngularLibraryService.firebaseUiInstance.disableAutoSignIn();
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: this.fb.control('', [Validators.email, Validators.required]),
      password: this.fb.control('', [Validators.required])
    })
  }

  login() {
    
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

}
