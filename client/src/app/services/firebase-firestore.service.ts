import { Injectable } from '@angular/core';
import {
  CollectionReference,
  Firestore,
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';

type UserData = {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
};

@Injectable({
  providedIn: 'root',
})
export class FirebaseFirestoreService {
  private userProfileReference!: CollectionReference;

  constructor(private afs: Firestore) {
    this.userProfileReference = collection(this.afs, 'users');
  }

  async findUser(uid: string): Promise<UserDataWithRole | null> {
    const q = query(this.userProfileReference, where("uid", "==", uid))
    const querySnapShot = await getDocs(q);
    if (querySnapShot.empty) {return null}
    let userData = querySnapShot.docs[0];
    return {
      uid: userData.get("uid"),
      email: userData.get("email"),
      firstName: userData.get("firstName"),
      lastName: userData.get("lastName"),
      role: userData.get("role")
    } as UserDataWithRole
  }

  async createNewUser(userData: UserData) {
    return await addDoc(this.userProfileReference, {
      ...userData,
      role: 'user',
    });
  }

  async createNewMerchant(userData: UserData) {
    return await addDoc(this.userProfileReference, {
      ...userData,
      role: 'merchant',
    });
  }
}
