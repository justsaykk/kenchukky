import { inject } from "@angular/core"
import { FirebaseAuthenticationService } from "./firebase-authentication.service"
import { Router } from "@angular/router"
import { filter, map, take } from "rxjs"
import { FirebaseFirestoreService } from "./firebase-firestore.service"
import { DocumentData } from "firebase/firestore"

export const authGuard = async () => {
    console.log("Checking Auth State");
    const authService = inject(FirebaseAuthenticationService)
    const router = inject(Router)
    let authState: boolean = false;
    await authService.authState$.pipe(take(1)).forEach(user => authState = !!user)
    console.log(authState);
    return authState;
}

export const isUser = async () => {
    console.log("Checking isUser");
    const firestore = inject(FirebaseFirestoreService)
    const authService = inject(FirebaseAuthenticationService)
    let uid = ""
    await authService.user$.pipe(take(1), filter(user => null != user)).forEach((user) => uid = user?.uid!)
    let userData: DocumentData | null = await firestore.findUser(uid);
    if (!userData) {return false};
    let role = userData["_document"].data.value.mapValue.fields.role.stringValue;
    if ("user" == role) {return true}
    return false
}

export const isMerchant = async () => {
    console.log("Checking isMerchant");
    
    const firestore = inject(FirebaseFirestoreService)
    const authService = inject(FirebaseAuthenticationService)
    let uid = ""
    authService.user$.pipe(take(1), filter(user => null != user)).forEach((user) => uid = user?.uid!)
    let userData: DocumentData | null = await firestore.findUser(uid);
    if (!userData) {return false};

    console.log(userData);
    
    let role = userData["_document"].data.value.mapValue.fields.role.stringValue;

    if ("merchant" == role) {return true}
    return false
}