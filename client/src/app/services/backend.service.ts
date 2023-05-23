import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, filter, firstValueFrom, map, take } from 'rxjs';
import { DatePipe } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';
import { ServerUser } from '../models/models';

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
  private _loggedInUser = new BehaviorSubject<ServerUser | null> (null)

  constructor(
    private datePipe: DatePipe,
    private http: HttpClient,
  ) { }

  //Getters
  public getLoggedInUser(): Observable<ServerUser | null> {return this._loggedInUser.asObservable()}

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

  async getServerUser(uid: string): Promise<ServerUser> {
    let url = this.BACKEND + `/api/user?userId=${uid}`
    let serverUser = await firstValueFrom(this.http.get<ServerUser>(url));
    this._loggedInUser.next(serverUser)
    return serverUser;
}

  async postCompletedForm(merchantId: string, numberOfContainers: number, _uom: string) {
    let url = this.BACKEND + `/api/user/order`
    let headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("merchantId", merchantId)

    let user = this.getLoggedInUser().pipe(
      take(1), 
      filter((data): data is ServerUser => !!data), 
      map(user => user))

    let payload: OrderData = {
      orderId: this.generateUUID(),
      userId: (await firstValueFrom(user)).userId,
      username: (await firstValueFrom(user)).username,
      timeOfOrder: this.formatDateTime(new Date())!,
      qty: numberOfContainers,
      uom: _uom
    }

    this.http.post(url, payload, {headers})
  }

  public updateUserPoints(uid: string, userPoints: number) {
    let url = this.BACKEND + "/api/user/points"
    let headers = new HttpHeaders()
      .set("Content-Type", "application/json")
    
    let payload = {
      userId: uid,
      pointsRemaining: userPoints
    }
    this.http.put(url, payload, {headers})
  }

  // Helper Methods
  private formatDateTime(dateTime: Date) {
    return this.datePipe.transform(dateTime, 'dd-MM-yyyy HH:mm');
  }

  private generateUUID() {
    return uuidv4().substring(0, 8);
  }

  postNewUser (userData: any) {
    let url = this.BACKEND + "/api/user"
    let headers = new HttpHeaders()
      .set("Content-Type", "application/json")
    
    let body = {
      userId: userData.uid,
      username: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      totalPoints: 0,
    }
    
    this.http.post(url, body, {headers})
  }

}
