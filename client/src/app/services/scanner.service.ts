import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScannerService {

  merchantId = new BehaviorSubject<string>("");

  constructor() { }

  getMerchantId(): Observable<string> { return this.merchantId.asObservable() }
  setMerchantId(id: string) { this.merchantId.next(id) } 

}
