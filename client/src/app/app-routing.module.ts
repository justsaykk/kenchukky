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
import { MerchantSignupComponent } from './pages/merchant-signup/merchant-signup.component';
import { authGuard, isMerchant, isUser } from './services/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'animation', component: AnimationComponent },
  { path: 'merchant/signup', component: MerchantSignupComponent},
  // Protected Routes
  { path: 'customer/home', component: HomeComponent, canActivate:[authGuard, isUser] },
  { path: 'customer/qrscanner', component: QrscannerComponent, canActivate:[authGuard, isUser] },
  { path: 'customer/points/history', component: PointsHistoryComponent, canActivate:[authGuard, isUser] },
  { path: 'customer/qrscanner/confirmation', component: ScannerConfirmationComponent, canActivate:[authGuard, isUser]},
  { path: 'customer/voucher/redemption', component: VoucherRedemptionComponent, canActivate:[authGuard, isUser]},
  { path: 'merchant/home', component: CurrentTransactionsComponent, canActivate:[authGuard, isMerchant] },
  { path: 'merchant/qr', component: QrcodeComponent, canActivate:[authGuard, isMerchant] },
  // Catch-All
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
