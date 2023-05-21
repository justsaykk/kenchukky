import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/customer/home.component';
import { PointsHistoryComponent } from './components/customer/points-history.component';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { CurrentTransactionsComponent } from './components/merchant/current-transactions.component';
import { QrcodeComponent } from './components/merchant/qrcode.component';
import { AnimationComponent } from './components/animation.component';
import { QrscannerComponent } from './components/qrscanner/qrscanner.component';
import { ScannerConfirmationComponent } from './components/customer/scanner-confirmation.component';
import { VoucherRedemptionComponent } from './components/customer/voucher-redemption.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'animation', component: AnimationComponent },
  { path: 'customer/home', component: HomeComponent },
  { path: 'customer/qrscanner', component: QrscannerComponent },
  { path: 'customer/points/history', component: PointsHistoryComponent },
  {
    path: 'customer/qrscanner/confirmation',
    component: ScannerConfirmationComponent,
  },
  {
    path: 'customer/voucher/redemption',
    component: VoucherRedemptionComponent,
  },
  { path: 'merchant/home', component: CurrentTransactionsComponent },
  { path: 'merchant/qr', component: QrcodeComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
