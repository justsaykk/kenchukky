import { inject } from "@angular/core"
import { FirebaseAuthenticationService } from "./firebase-authentication.service"
import { CanActivateFn, Router } from "@angular/router"
import { filter, take } from "rxjs"
import { FirebaseFirestoreService } from "./firebase-firestore.service"
import { UserDataWithRole } from "../models/models"

export const authGuard: CanActivateFn = async () => {
    console.log("Checking Auth State");
    const authService = inject(FirebaseAuthenticationService)
    const router = inject(Router)
    let authState: boolean = false;
    await authService.authState$.pipe(take(1)).forEach(user => authState = !!user)
    if (!authState) {
        router.navigate(["/login"])
    }
    return authState;
}

export const isUser = async () => {
    const firestore = inject(FirebaseFirestoreService)
    const authService = inject(FirebaseAuthenticationService)
    let uid = ""
    await authService.user$.pipe(take(1), filter(user => null != user)).forEach((user) => uid = user?.uid!)
    let userData: UserDataWithRole | null = await firestore.findUser(uid);
    if (!userData) {return false};
    if ("user" == userData.role) {
        return true}
    return false
}

export const isMerchant = async () => {
    const firestore = inject(FirebaseFirestoreService)
    const authService = inject(FirebaseAuthenticationService)
    let uid = ""
    await authService.user$.pipe(take(1), filter(user => null != user)).forEach((user) => uid = user?.uid!)
    let userData: UserDataWithRole | null = await firestore.findUser(uid);
    if (!userData) {return false};
    if ("merchant" == userData.role) {
        return true
    }
    return false
}