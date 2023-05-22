import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'firebase/auth';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { FirebaseAuthenticationService } from 'src/app/services/firebase-authentication.service';
import { FirebaseFirestoreService } from 'src/app/services/firebase-firestore.service';

@Component({
  selector: 'app-merchant-signup',
  templateUrl: './merchant-signup.component.html',
  styleUrls: ['./merchant-signup.component.css']
})
export class MerchantSignupComponent {
  signUpForm!: FormGroup;
  authState$!: Subscription;
  authState!: User | null;

  constructor(
    private fb: FormBuilder,
    private authSvc: FirebaseAuthenticationService,
    private firestoreSvc: FirebaseFirestoreService,
    private router: Router,
    private location: Location,
  ) {
    this.authState$ = this.authSvc.authState$.subscribe((state: User | null) => this.authState = state);
  }

  ngOnInit(): void {
    if (null == this.authState) {
      this.createForm();
    }
  }

  ngOnDestroy(): void {
      this.authState$.unsubscribe();
  }

  createForm() {
    this.signUpForm = this.fb.group({
      email: this.fb.control('', [Validators.required, Validators.email]),
      firstName: this.fb.control('', [Validators.required]),
      lastName: this.fb.control('', [Validators.required]),
      password: this.fb.control('', [Validators.required])
    })
  }

  async signUp() {
    const signUpData = {
      email: this.signUpForm.value.email,
      password: this.signUpForm.value.password
    }
    const userUid = await this.authSvc.firebaseSignUp(signUpData);

    const userData = {
      uid: userUid,
      email: this.signUpForm.value.email,
      firstName: this.signUpForm.value.firstName,
      lastName: this.signUpForm.value.lastName
    }
    await this.firestoreSvc.createNewMerchant(userData);
    this.router.navigateByUrl("/")
  }

  goBack(): void {this.location.back()}
}
