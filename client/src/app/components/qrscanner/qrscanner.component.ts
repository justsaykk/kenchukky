import { Component, OnInit, ViewChild } from '@angular/core';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';

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

  ngOnInit(): void {
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
    console.debug('Result: ', resultString);
    this.qrResultString = resultString;
  }
}

