import { Injectable } from '@angular/core';
import { Auth, UserCredential, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, user } from '@angular/fire/auth';

type UserCredentialForm = {
  email: string,
  password: string
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthenticationService {
  authState$ = authState(this.auth)
  constructor(
    private auth: Auth
    ) { }

  public async firebaseLogin(login: UserCredentialForm): Promise<string | null> {
    const userCredentials: UserCredential = await signInWithEmailAndPassword(this.auth, login.email, login.password);
    return userCredentials.user.displayName
  }

  public async firebaseSignUp(newUser: UserCredentialForm) {
    const userCredentials: UserCredential = await createUserWithEmailAndPassword(this.auth, newUser.email, newUser.password);
    return userCredentials.user.uid
  }

  public logout() { this.auth.signOut() }
}
