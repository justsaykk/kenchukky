import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ServerUser, Voucher } from 'src/app/models/models';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-voucher-redemption',
  templateUrl: './voucher-redemption.component.html',
  styleUrls: ['./voucher-redemption.component.css']
})
export class VoucherRedemptionComponent implements OnInit {
  
  vouchersTestInput = [
    {
      name: '$5 NEA eVoucher',
      amount: '$5',
      points: 1500,
      quantity: 0,
    },
    {
      name: '$10 NEA eVoucher',
      amount: '$10',
      points: 3000,
      quantity: 0,
    },
    {
      name: '$5 CDL eVoucher',
      amount: '$5',
      points: 1500,
      quantity: 0,
    },
    {
      name: '$10 CDL eVoucher',
      amount: '$10',
      points: 3000,
      quantity: 0,
    },
  ];
  vouchers: Voucher[] = []; 
  userPoints!: number; 
  userDollars!: string;
  loggedInUser!: ServerUser | null;

  constructor(
    private backendService: BackendService
  ) {
    this.backendService.getLoggedInUser().forEach((user) => this.loggedInUser = user)
  }

  ngOnInit(): void {
    this.vouchersTestInput.map((voucher) => {
      this.vouchers.push(voucher);
    })

    this.userPoints = this.loggedInUser?.points!; 
    this.userDollars = (this.userPoints/300).toFixed(2);

  }

  addVoucherQty(voucher: Voucher) {
    voucher.quantity++;
    this.calculateUserPoints(voucher.points);
  }
  
  minusVoucherQty(voucher: Voucher) {
    voucher.quantity--;
    this.calculateUserPoints((voucher.points * -1));
  }

  calculateUserPoints(voucherPointsRequired: number) {
    this.userPoints = this.userPoints - voucherPointsRequired;
    this.userDollars = (this.userPoints/300).toFixed(2);
  }

  handleVoucherRedemption() {
    this.backendService.updateUserPoints(this.loggedInUser!.userId, this.userPoints);
  }

}
