import { Component } from '@angular/core';
import { Merchant } from 'src/app/models/models';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css'],
})
export class QrcodeComponent {
  // TODO: fetch merchant from db on init
  merchant = {
    merchantId: '123',
    merchantName: 'kenchukky fried chicken',
  };
}
