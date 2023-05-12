import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirebaseUISignInFailure, FirebaseUISignInSuccessWithAuthResult, FirebaseuiAngularLibraryService } from 'firebaseui-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private auth: Auth = inject(Auth)

  constructor(
    private firebaseuiAngularLibraryService: FirebaseuiAngularLibraryService,
    private router: Router,
    private location: Location 
  ) {
    this.firebaseuiAngularLibraryService.firebaseUiInstance.disableAutoSignIn();
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
