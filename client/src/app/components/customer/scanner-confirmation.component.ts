import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { filter, firstValueFrom, take } from 'rxjs';
import { quantity, uom } from 'src/app/models/models';
import { BackendService } from 'src/app/services/backend.service';
import { ScannerService } from 'src/app/services/scanner.service'

@Component({
  selector: 'app-scanner-confirmation',
  templateUrl: './scanner-confirmation.component.html',
  styleUrls: ['./scanner-confirmation.component.css']
})
export class ScannerConfirmationComponent implements OnInit {

  form!: FormGroup;

  selectUom!: string;
  uom = uom; 
  quantity = quantity;
  merchantId!: string; 

  constructor(
    private fb: FormBuilder,
    private backendSvc: BackendService,
    private scannerSvc: ScannerService,
    private router: Router,
  ) {}
  
  async ngOnInit() {
    this.form = this.createForm();
    this.merchantId = await firstValueFrom(
      this.scannerSvc.getMerchantId().pipe(take(1))
    ); 
  }

  createForm(): FormGroup {
    return this.fb.group({
      // merchantId: this.fb.control('', [
      //   Validators.required,
      // ]),
      merchantName: this.fb.control('', [
        Validators.required,
      ]),
      // customerId: this.fb.control('', [
      //   Validators.required,
      // ]),
      // customerUsername: this.fb.control('', [
      //   Validators.required,
      // ]),
      uom: this.fb.control('', [
        Validators.required,
      ]),
      quantity: this.fb.control('', [
        Validators.required,
        Validators.min(1), 
        Validators.max(10)
      ]),
    });
  }

  async submit() {
    // post to back end
    let merchantId: string = await firstValueFrom(
      this.scannerSvc.getMerchantId().pipe(take(1))
      ) 

    try {
      this.backendSvc.postCompletedForm(merchantId, this.form.value.quantity, this.form.value.uom)
      this.router.navigate(['/customer/home']);
    } catch (error) {
      console.error(">>>>> posting order error: ", error);
    }
  }
}
