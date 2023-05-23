import { Injectable } from '@angular/core';
import { Auth, UserCredential, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, user } from '@angular/fire/auth';
import { UserDataWithRole } from '../models/models';
import { FirebaseFirestoreService } from './firebase-firestore.service';
import { filter, take } from 'rxjs';
import { Router } from '@angular/router';
import { BackendService } from './backend.service';

type UserCredentialForm = {
  email: string,
  password: string
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthenticationService {
  authState$ = authState(this.auth)
  user$ = user(this.auth)
  
  constructor(
    private auth: Auth,
    private afs: FirebaseFirestoreService,
    private backendSvc: BackendService,
    private router: Router
    ) { }

  public async firebaseLogin(login: UserCredentialForm): Promise<string | null> {
    const userCredentials: UserCredential = await signInWithEmailAndPassword(this.auth, login.email, login.password);
    this.backendSvc.getServerUser(userCredentials.user.uid)
    this.redirectOut();
    return userCredentials.user.email
  }

  public async firebaseSignUp(newUser: UserCredentialForm) {
    const userCredentials: UserCredential = await createUserWithEmailAndPassword(this.auth, newUser.email, newUser.password);
    this.backendSvc.getServerUser(userCredentials.user.uid)
    this.redirectOut()
    return userCredentials.user.uid
  }

  private async redirectOut() {
    let uid = "";
    await this.user$.pipe(take(1), filter(user => null != user)).forEach((user) => uid = user?.uid!)
    let userData: UserDataWithRole | null = await this.afs.findUser(uid);
    switch (userData?.role) {
      case "user":
        this.router.navigateByUrl("/customer/home")
        break;
      case "merchant":
        this.router.navigateByUrl("/merchant/home")
        break;

      default:
        break;
    }
  }

  public logout() { this.auth.signOut() }
}
