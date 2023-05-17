import { Injectable, inject } from '@angular/core';
import { CollectionReference, Firestore, addDoc, collection } from '@angular/fire/firestore';

type UserData = {
  email: string,
  firstName: string,
  lastName: string
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseFirestoreService {
  private firestore: Firestore = inject(Firestore);
  userProfileReference!: CollectionReference

  constructor() {
    this.userProfileReference = collection(this.firestore, 'users');
  }

  async createNewUser(userData: UserData) {
    await addDoc(this.userProfileReference, {
      ...userData,
      role: "user"
      }
    )
  }
}