import { Component, OnInit, ViewChild } from '@angular/core';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { NotificationService } from 'src/app/services/notification.service';
import { Router } from '@angular/router';
import { ScannerService } from 'src/app/services/scanner.service';

@Component({
  selector: 'app-qrscanner',
  templateUrl: './qrscanner.component.html',
  styleUrls: ['./qrscanner.component.css'],
})
export class QrscannerComponent implements OnInit {
  @ViewChild('scanner')
  scanner!: ZXingScannerComponent;

  qrResultString!: string;

  availableDevices!: MediaDeviceInfo[];
  currentDevice!: MediaDeviceInfo;

  // <--------------------- USER INFORMATION --------------------->
  // testCustomerUsername = "jack";
  // testCustomerId = "abc123";
  // orderId!: string; 

  constructor(
    private notificationService: NotificationService,
    private scannerService: ScannerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Generate token when camera is initiated
    this.notificationService.fbGenerateToken()
    this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
      this.availableDevices = devices;

      for (const device of devices) {
        if (/back|rear|environment/gi.test(device.label)) {
          new this.scanner.deviceChange();
          this.currentDevice = device;
          break;
        }
      }
    });
  }

  handleQrCodeResult(resultString: string) {
    this.qrResultString = resultString;
    this.router.navigate(['/customer/qrscanner/confirmation']);
    this.scannerService.merchantId = resultString; 
    console.info('Result: ', resultString);
    console.info('merchantId in service >>> ', this.scannerService.merchantId);
  }
}
