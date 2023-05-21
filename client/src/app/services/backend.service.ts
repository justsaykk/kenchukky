import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FirebaseAuthenticationService } from './firebase-authentication.service';
import { filter, firstValueFrom, map, take } from 'rxjs';
import { DatePipe } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@angular/fire/auth';

type OrderData = {
  orderId: string,
  userId: string,
  username: string,
  timeOfOrder: string,
  qty: number,
  uom: string
}

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  
  BACKEND = environment.BACKEND

  constructor(
    private datePipe: DatePipe,
    private http: HttpClient,
    private authSvc: FirebaseAuthenticationService,
  ) { }

  storeNotificationToken(token: string, uid: string) {
    let url = this.BACKEND + "/api/user"
    let headers = new HttpHeaders()
      .set("Content-Type", "application/json")
    
    let body = {
      userId: uid,
      token: token
    }
    
    this.http.post(url, body, {headers})
  }

  async postCompletedForm(merchantId: string, numberOfContainers: number, _uom: string) {
    let url = this.BACKEND + `/api/user/order`
    let headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("merchantId", merchantId)
    
    let user = this.authSvc.user$.pipe(
      take(1),
      filter((data): data is User => !!data),
      map(user => user))

    let payload: OrderData = {
      orderId: this.generateUUID(),
      userId: (await firstValueFrom(user)).uid,
      username: (await firstValueFrom(user)).email!,
      timeOfOrder: this.formatDateTime(new Date())!,
      qty: numberOfContainers,
      uom: _uom
    }

    this.http.post(url, payload, {headers})
  }

  // Helper Methods
  private formatDateTime(dateTime: Date) {
    return this.datePipe.transform(dateTime, 'dd-MM-yyyy HH:mm');
  }

  private generateUUID() {
    return uuidv4().substring(0, 8);
  }

}
