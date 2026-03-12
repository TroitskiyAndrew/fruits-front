export interface IUser {
  id: string;
  user: ITelegrammUser;
  userId: number;
  pressedStart: boolean;
  admin: boolean;
  source: string;
  referral?: number;
  sources: string[];
  path: string[];
  _created: bigint;
  sessionId: string;
}

export interface ITelegrammUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
}

export interface Order {
  userId: number;
  source: string;
  total: number;
  confirmed: boolean;
  products: IOrderProduct[];
  deleted: boolean;
  referral?: number;
}

export interface IOrderProduct {
  product: IProduct;
  amount: number;
  price: number;
  currency: Currency;
  contains: IOrderProduct[];
}

export enum Currency{
  Rub = 'rub',
  VND = 'vnd',
  USDT = 'usdt'
}

export interface IProduct {
  id: string;
  name: string;
  description: string;
  measure: string;
  amount: number;
  deleted: boolean;
  price: Record<Currency, number>
}

export interface ISet extends IProduct {
  defaultProducts: Record<string, IProduct>
  additionalProducts: Record<string, IProduct>
}

export interface IPayment {
  id: string;
  from: number;
  to: number;
  amount: number;
  currency: Currency;
  payed: bigint | null;
  confirmed: boolean,
}

export enum PaymentType {
  Client,
  Supplier,
  Referral,
  Service,
}

export interface Share {
  id: string;
  paymentId: string;
  orderId: string;
  amount: number;
  currency: Currency;
  payed: bigint | null;
  confirmed: boolean,
  type: PaymentType;
}

