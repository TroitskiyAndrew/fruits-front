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
  _created: number;
  sessionId: string;
  paymentMethods: IPaymentMethods;
}

export type UserForm = Pick<IUser, 'admin' | 'paymentMethods'>

export enum OnlinePaymentOption {
  QR = 'qr',
  Account = 'account',
}

export type IAccount = {
  paymentOption: OnlinePaymentOption;
  account: string;
  comment?: string
}

export type AccountForm = Pick<IAccount, 'paymentOption' | 'comment'> & {
  accountInfo?: string
  qrUrl?: string
}

export type IPaymentMethods = Record<Currency, IAccount | null>;

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
  payed: number | null;
  confirmed: number | null;
  packed: number | null;
  delivered: number | null;
  deleted: number | null;
}
export interface IOrderContent {
  prices: IPrices,
  currency: Currency;
  products: OrderProduct[];
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
  status: IOrderStatus;
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
export type OrderProduct<T = Product> = T & { count: number, fixedCount?: number, orderAddon?: boolean };

export type ISetProducts = Record<string, OrderProduct<ISimpleProduct>>;

export interface ISet extends ProductBase {
  products: ISetProducts;
  fixedSet: boolean;
  set: true;
}

export type ProductForm = Omit<ISet, 'set' | 'products'> & {
  set: boolean;
  products: Record<string, number>;
  orderAddon: boolean
}

export interface ISimpleProduct extends ProductBase { set: false, orderAddon: boolean };

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
  payed: number | null;
  confirmed: number | null;
  image: string;
}

export enum PaymentType {
  Unknown,
  Client,
  Supplier,
  Referral,
  Service,
}

export interface IPayOptions {
  currency: Currency;
  image?: string;
  when: number;
  amount: number;
  method: PaymentMethod;
  paymentId: string;
}
export interface Share {
  id: string;
  from: number;
  to: number;
  paymentId: string;
  orderId: string;
  amounts: IPrices;
  type: PaymentType;
  payed: number | null;
}

export type ControlsOf<T> = {
  [K in keyof T]:
  T[K] extends Record<string, any>
  ? FormGroup<any>
  : FormControl<T[K]>
}

export interface INewOrderInfo {
  order: IOrder,
  payment: IPayment,
}

export interface IConfig {
  cashierId: number;
  referralUrlBase: string;
}
