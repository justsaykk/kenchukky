import { Component, OnInit } from '@angular/core';
import {
  AnimalCssClass,
  OceanAnimal,
  OceanAnimalImages,
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
  oceanQuality: number = 30;
  oceanCurrentCleanliness!: string;
  oceanCleanlinessLevels = OceanCleanlinessLevels;

  // <--------------- TRASH VARIABLES --------------->
  amountOfTrash: number = 100 - this.oceanQuality;
  trashImages = TrashImages;
  trashCollection: Trash[] = [];

  // <--------------- ANIMAL VARIABLES --------------->
  amountOfMarineAnimals: number = 30;
  oceanAnimalsCollection: OceanAnimal[] = [];
  oceanAnimalImages = OceanAnimalImages;
  animalCssClass = AnimalCssClass;
  
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

  createMarineWildlife(amountOfMarineAnimals: number) {
    for (let i = 0; i < amountOfMarineAnimals; i++) {
      let randomAnimal =
        this.oceanAnimalImages[this.randomizer(this.oceanAnimalImages.length)];
      let cssClass =
        this.animalCssClass[this.randomizer(this.animalCssClass.length)];
      let topPosition = this.randomizer(100);
      console.info('cssClass >>> ', cssClass[cssClass.length - 1]);
      let leftPosition!: number;
      if (
        Number(cssClass[cssClass.length - 1]) > 0 &&
        Number(cssClass[cssClass.length - 1]) < 6
      )
        leftPosition = this.randomizer(0, -10);
      else leftPosition = this.randomizer(150, 100);

      this.oceanAnimalsCollection.push(
        new OceanAnimal(
          randomAnimal,
          cssClass,
          `${topPosition}vh`,
          `${leftPosition}vw`
        )
      );
    }

    console.info('animal collection >>> ', this.oceanAnimalsCollection);
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
