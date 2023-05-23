import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Order } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class MerchantService {
  BACKEND = "https://kenchukky-server.up.railway.app"
  constructor(private httpClient: HttpClient) {}

  getRecentOrders(merchantId: string): Promise<Order[]> {
    let url = this.BACKEND + "/api/merchant/orders"
    const params = new HttpParams().set('merchantId', merchantId);
    return lastValueFrom(
      this.httpClient.get<Order[]>(url, { params: params })
    );
  }

  // FIXME: returning 500 error
  sendOrderConfirmation(orderStatus: any) {
    let url = this.BACKEND + '/api/merchant/order'
    const body = JSON.stringify(orderStatus);
    return lastValueFrom(this.httpClient.post(url, body));
  }
}
