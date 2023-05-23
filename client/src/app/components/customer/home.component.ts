import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
} from '@angular/core';
import {
  OceanCleanlinessLevels,
  Trash,
  TrashImages,
} from '../../models/models';
import { ScannerService } from 'src/app/services/scanner.service';
import { getMessaging, onMessage } from '@firebase/messaging';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  // <--------------- OCEAN VARIABLES --------------->
  oceanQuality: number = 75;
  oceanCurrentCleanliness!: string;
  oceanCleanlinessLevels = OceanCleanlinessLevels;

  // <--------------- TRASH VARIABLES --------------->
  amountOfTrash: number = 100 - this.oceanQuality;
  trashImages = TrashImages;
  trashCollection: Trash[] = [];

  // <--------------- USER VARIABLES --------------->
  challenges = [1, 2, 3, 4];
  progressValue: number = 50;

  targetElement!: Element | null;
  spinnerSize: number = 100

  constructor(private scannerService: ScannerService) {}

  ngOnInit(): void {
    this.targetElement = document.querySelector('html');
    this.listen();
  }

  calculateProgress(event: any) {
    console.info('>>> calculate progress: ', event.target.checked);
    if (event.target.checked) this.progressValue += 25;
    if (event.target.checked === false) this.progressValue -= 25;
  }

  listen() {
    const messaging = getMessaging();
    console.info('Listening for notification');
    onMessage(messaging, (payload) => {
      this.progressValue += 25;
      this.oceanQuality += 5;
      console.info('Messaged received', payload);
    });
  }

  myRefreshEvent(event: Subject<void>, message: string) {
    setTimeout(() => {
        //alert(message);
        event.next();
        window.location.reload();
    }, 1000);
  }

  check(challenge: number) {
    switch (challenge) {
      case 1: {
        if (this.progressValue >= 25) return true;
        else return false;
      }
      case 2: {
        if (this.progressValue >= 50) return true;
        else return false;
      }
      case 3: {
        if (this.progressValue >= 75) return true;
        else return false;
      }
      case 4: {
        if (this.progressValue >= 100) return true;
        else return false;
      }
      default: {
        return false;
      }
    }
  }
}
