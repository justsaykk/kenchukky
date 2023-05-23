export const OceanCleanlinessLevels = [
  'ocean-clean',
  'ocean-not-so-clean',
  'ocean-dirty',
];

export const TrashImages: string[] = ['shopping-bag.png', 'takeout-box.png'];

export const uom: string[] = ['Container(s)', 'Cup(s)'];

export const quantity = [...Array(11).keys()];

export class Voucher {
  constructor(name: string, amount: string, points: number, quantity: number) {
    this.name = name;
    this.amount = amount;
    this.points = points;
    this.quantity = quantity;
  }
  name: string;
  amount: string;
  points: number;
  quantity: number;
}

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

export interface Merchant {
  merchantId: string;
  merchantName: string;
}

export interface Order {
  orderId: string;
  customerId: string;
  customerName: string;
  timeOfOrder: string;
  qty: number;
  uom: string;
}

export interface NotificationData {
  senderToken: string | null;
  orderId: string | null;
  customerName: string | null;
  timeOfOrder: string | null;
  qty: number | null;
  uom: string | null;
}
