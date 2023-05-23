import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { filter, take } from 'rxjs';
import { FirebaseAuthenticationService } from 'src/app/services/firebase-authentication.service';

export interface DialogData {
  merchantId: string
}

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css'],
})
export class QrcodeComponent {
  constructor (@Inject(MAT_DIALOG_DATA) public data: DialogData) { }
}
