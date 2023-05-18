import { Component, OnInit } from '@angular/core';
import {
  OceanCleanlinessLevels,
  Trash,
  TrashImages,
} from '../models/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  // <--------------- OCEAN VARIABLES --------------->
  oceanQuality: number = 80;
  oceanCurrentCleanliness!: string;
  oceanCleanlinessLevels = OceanCleanlinessLevels;

  // <--------------- TRASH VARIABLES --------------->
  amountOfTrash: number = 100 - this.oceanQuality;
  trashImages = TrashImages;
  trashCollection: Trash[] = [];
  
  // <--------------- USER VARIABLES --------------->
  challenges = [1, 2, 3, 4]
  progressValue: number = 0;

  ngOnInit(): void {
    this.checkOceanQuality(this.oceanQuality);
  }

  calculateProgress(event: any) {
    console.info(">>> calculate progress: ", event.target.checked);
    if(event.target.checked) this.progressValue += 25; 
    if(event.target.checked === false) this.progressValue -= 25; 
  }

  // createTrashCollection(amountOfTrash: number) {
  //   for (let i = 0; i < amountOfTrash; i++) {
  //     let randomTrash =
  //       this.trashImages[this.randomizer(this.trashImages.length)];
  //     console.info('randomTrash >>> ', randomTrash);
  //     this.trashCollection.push(randomTrash);
  //   }
  // }

  checkOceanQuality(oceanQuality: number) {
    if (oceanQuality >= 75)
      this.oceanCurrentCleanliness = this.oceanCleanlinessLevels[0];
    else if (oceanQuality >= 50 && oceanQuality < 75)
      this.oceanCurrentCleanliness = this.oceanCleanlinessLevels[1];
    else this.oceanCurrentCleanliness = this.oceanCleanlinessLevels[2];
  }

  randomizer(numMax: number, numMin: number = 0) {
    return (Math.floor(Math.random() * (numMax - numMin)) + numMin);
  }
}
