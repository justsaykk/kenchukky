import { Component, OnInit, ViewChild } from '@angular/core';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { NotificationService } from 'src/app/services/notification.service';

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

  constructor(private notificationService: NotificationService) { }

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
    console.info('Result: ', resultString);
    this.qrResultString = resultString;
  }
}

