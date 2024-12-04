export interface OrderItemDTO {
  itemID: string;
  productID: string;
  quantity: number;
  itemPrice: number;
}

export interface InputOrderDTO {
  orderDate: string;
  soldToID: string;
  billToID: string;
  shipToID: string;
  orderValue: number;
  taxValue: number;
  currencyCode: string;
  items: OrderItemDTO[];
}

export interface OutputOrderDTO {
  orderID: string;
}
