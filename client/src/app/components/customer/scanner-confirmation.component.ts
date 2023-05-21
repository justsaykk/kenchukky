import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { quantity, uom } from 'src/app/models/models';

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

  constructor(
    private fb: FormBuilder,
  ) {}
  
  ngOnInit(): void {
    this.form = this.createForm();
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

  submit() {
    // post to back end
  }

}
