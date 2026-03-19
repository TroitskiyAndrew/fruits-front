import { FormControl, FormGroup } from "@angular/forms";

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
  product: Product;
  amount: number;
  price: number;
  currency: Currency;
  contains: IOrderProduct[];
}

export enum Currency {
  Rub = 'rub',
  VND = 'vnd',
  USDT = 'usdt'
}

export enum Measure {
  KG = 'кг',
  Item = 'шт'
}

interface ProductBase {
  id: string;
  name: string;
  description: string;
  measure: Measure;
  amount: number;
  weight: number;
  deleted: boolean;
  price: Record<Currency, number>;
  set: boolean;
}

export type ISetProducts = Record<string, ISimpleProduct & { count: number }>;

export interface ISet extends ProductBase {
  products: ISetProducts;
  fixedSet: boolean;
  set: true;
}

export type ProductForm = Omit<ISet, 'set'>  & {
  set: boolean;
}

export interface ISimpleProduct extends ProductBase { set: false };

export type Product = ISet | ISimpleProduct;

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

export type ControlsOf<T> = {
  [K in keyof T]:
  T[K] extends Record<string, any>
  ? FormGroup<any>
  : FormControl<T[K]>
}

