import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FirebaseAuthenticationService } from './firebase-authentication.service';
import { map, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  
  BACKEND = environment.BACKEND

  constructor(
    private http: HttpClient,
    private authSvc: FirebaseAuthenticationService,
  ) { }

  storeNotificationToken(token: string, uid: string) {
    //TODO: Fill in backend URL
    let url = this.BACKEND + ""
    let headers = new HttpHeaders()
      .set("Content-Type", "application/json")
    
    this.http.post(url, {[uid]: token}, {headers})
  }

  postCompletedForm(merchantId: string, numberOfContainers: number) {
    //TODO: Fill in backend URL
    let url = this.BACKEND + `${merchantId}`
    let headers = new HttpHeaders()
      .set("Content-Type", "application/json")
    
    let email = this.authSvc.user$.pipe(
      take(1),
      map(user => user?.email)
    )

    let payload = {
      customerEmail: email,
      qty: numberOfContainers
    }

    this.http.post(url, payload, {headers})
  }

}
