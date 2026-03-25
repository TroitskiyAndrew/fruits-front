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

export enum PlaceType {
  Hotel = 'hotel',
  Airport = 'airport',
}

export enum DeliveryType {
  Reception = 'reception',
  Hands = 'hands',
}

export interface IOrderStatus {
  payed: boolean;
  confirmed: boolean;
  packed: boolean;
  delivered: boolean;
  deleted: boolean;
  sent: boolean;
}
export interface IOrderContent {
  prices: IPrices,
  currency: Currency;
  products: OrderProduct[];
  expressDelivery: boolean;
}
export interface IOrderDelivery {
  name: string;
  contact: string;
  placeType: PlaceType;
  place: string;
  placeAdd: string;
  date: string;
  deliveryType: DeliveryType
}
export interface IOrder {
  id: string;
  number: number;
  userId: number;
  referral?: number;
  source: string;
  lastSource: string;
  state: IOrderStatus;
  content: IOrderContent;
  delivery: IOrderDelivery;
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

export type IPrices = Record<Currency, number>;

interface ProductBase {
  id: string;
  name: string;
  description: string;
  measure: Measure;
  amount: number;
  weight: number;
  deleted: boolean;
  price: IPrices;
  set: boolean;
}
export type OrderProduct<T = Product> = T & { count: number, fixedCount?: number };

export type ISetProducts = Record<string, OrderProduct<ISimpleProduct>>;

export interface ISet extends ProductBase {
  products: ISetProducts;
  fixedSet: boolean;
  set: true;
}

export type ProductForm = Omit<ISet, 'set'>  & {
  set: boolean;
  products: Record<string, number>
}

export interface ISimpleProduct extends ProductBase { set: false };

export type Product = ISet | ISimpleProduct;

export enum PaymentMethod {
  Bank = 'bank',
  Cash = 'cash',
}

export interface IPayment {
  id: string;
  from: number;
  to: number;
  amount: number;
  currency: Currency;
  amounts: IPrices;
  method: PaymentMethod;
  payed: bigint | null;
  confirmed: bigint | null;
  image: string;
}

export enum PaymentType {
  Unknown,
  Client,
  Supplier,
  Referral,
  Service,
}

export interface Share {
  id: string;
  from: number;
  to: number;
  paymentId: string;
  orderId: string;
  amounts: IPrices;
  type: PaymentType;
  payed: bigint | null;
}

export type ControlsOf<T> = {
  [K in keyof T]:
  T[K] extends Record<string, any>
  ? FormGroup<any>
  : FormControl<T[K]>
}

