import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { FirebaseAuthenticationService } from 'src/app/services/firebase-authentication.service';
import { FirebaseFirestoreService } from 'src/app/services/firebase-firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnDestroy, OnInit{
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
    await this.firestoreSvc.createNewUser(userData);
    this.router.navigateByUrl("/")
  }

  goBack(): void {this.location.back()}
}
