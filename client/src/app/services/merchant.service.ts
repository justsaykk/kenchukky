import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Order } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class MerchantService {
  constructor(private httpClient: HttpClient) {}

  getRecentOrders(merchantId: string): Promise<Order[]> {
    const headers = new HttpHeaders().set('merchantId', merchantId);
    return lastValueFrom(
      this.httpClient.get<Order[]>('/api/merchant/orders', { headers: headers })
    );
  }
}
