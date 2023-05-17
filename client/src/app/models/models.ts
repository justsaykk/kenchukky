export const OceanCleanlinessLevels = [
  'ocean-clean',
  'ocean-not-so-clean',
  'ocean-dirty',
];

export const TrashImages: string[] = [
  'plastic-cup.png',
  'shopping-bag.png',
  'takeout-box.png',
];

export const OceanAnimalImages: string[] = [
  'bluefin-fish.png',
  'bluefish.png',
  'clown-fish.png',
  'crab.png',
  'lobster.png',
];

export const AnimalCssClass: string[] = [
  'animal--1',
  'animal--2',
  'animal--3',
  'animal--4',
  'animal--5',
  'animal--6',
  'animal--7',
  'animal--8',
  'animal--9',
  'animal--10',
];

export class OceanAnimal {
  constructor(image: string, cssClass: string, top: string, left: string) {
    this.image = image;
    this.cssClass = cssClass;
    this.top = top;
    this.left = left;
  }
  image: string;
  cssClass: string;
  top: string;
  left: string;
}

export class Trash {
  constructor(image: string, top: number, left: number) {
    this.image = image;
    this.top = top;
    this.left = left;
  }
  image: string;
  top: number;
  left: number;
}
