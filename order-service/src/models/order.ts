import { Person } from './person';

export interface OrderItem {
  itemID: string;
  productID: string;
  quantity: number;
  itemPrice: number;
}

export interface Order {
  orderID: string;
  orderDate: string;
  soldTo: Person;
  billTo: Person;
  shipTo: Person;
  orderValue: number;
  taxValue: number;
  currencyCode: string;
  items: OrderItem[];
}
