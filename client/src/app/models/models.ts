export const OceanCleanlinessLevels = ['ocean-clean', 'ocean-not-so-clean', 'ocean-dirty'];

export const TrashImages: string[] = [
  'plastic-cup.png',
  'shopping-bag.png',
  'takeout-box.png',
];

export class OceanAnimal {
    constructor(image: string, cssClass: string, top: string, left: string) {
        this.image = image;
        this.cssClass = cssClass;
        this.top = top;
        this.left = left;
    }
    image: string
    cssClass: string
    top: string
    left: string
}

export class Trash {
    constructor(image: string, top: number, left: number) {
        this.image = image;
        this.top = top;
        this.left = left;
    }
    image: string
    top: number
    left: number
}

