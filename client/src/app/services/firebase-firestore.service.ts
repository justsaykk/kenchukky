import { Injectable } from '@angular/core';
import { CollectionReference, Firestore, addDoc, collection, getDocs, query, where } from '@angular/fire/firestore';

type UserData = {
  uid: string,
  email: string,
  firstName: string,
  lastName: string
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseFirestoreService {
  private userProfileReference!: CollectionReference

  constructor(
    private afs: Firestore
    ) { 
    this.userProfileReference = collection(this.afs, 'users');
   }

  async findUser(uid: string) {
    const q = query(this.userProfileReference, where("uid", "==", uid))
    const querySnapShot = await getDocs(q);
    if (querySnapShot.empty) 
      return null
    return querySnapShot.forEach(user => user.data)
  }

  async createNewUser(userData: UserData) {
    return await addDoc(this.userProfileReference, {
      ...userData,
      role: "user"
      }
    )
  }

  async createNewMerchant(userData: UserData) {
    return await addDoc(this.userProfileReference, {
      ...userData,
      role: "merchant"
      }
    )
  }
}