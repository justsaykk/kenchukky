import { Injectable, inject } from '@angular/core';
import { Auth, UserCredential, authState, signInWithEmailAndPassword, user } from '@angular/fire/auth';

type LoginForm = {
  email: string,
  password: string
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthenticationService {
  private auth: Auth = inject(Auth)
  authState$ = authState(this.auth)

  constructor() { }

  public async firebaseLogin(login: LoginForm): Promise<string | null> {
    const userCredentials: UserCredential = await signInWithEmailAndPassword(this.auth, login.email, login.password);
    console.log(userCredentials);
    return userCredentials.user.displayName
  }
}
