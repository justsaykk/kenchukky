import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Order } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class MerchantService {
  constructor(private httpClient: HttpClient) {}

  getRecentOrders(merchantId: string): Promise<Order[]> {
    const params = new HttpParams().set('merchantId', merchantId);
    return lastValueFrom(
      this.httpClient.get<Order[]>('/api/merchant/orders', { params: params })
    );
  }

  // FIXME: returning 500 error
  sendOrderConfirmation(orderStatus: any) {
    const body = JSON.stringify(orderStatus);
    return lastValueFrom(this.httpClient.post('/api/merchant/order', body));
  }
}
