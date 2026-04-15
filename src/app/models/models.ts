import { FormControl, FormGroup } from '@angular/forms';

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
  currency: Currency;
}

export type UserForm = Pick<IUser, 'admin' | 'paymentMethods'>;

export enum OnlinePaymentOption {
  QR = 'qr',
  Account = 'account',
}
export interface OnlinePayment {
  paymentOption: OnlinePaymentOption;
  account: string;
  comment?: string;
}

export type IAccount = {
  bank: OnlinePayment | null;
  cash: boolean;
};

export type AccountForm = Pick<OnlinePayment, 'paymentOption' | 'comment'> & {
  accountInfo?: string;
  qrUrl?: string;
  bank: boolean;
} & Pick<IAccount, 'cash'>;

export type IPaymentMethods = Record<Currency, IAccount>;

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
  paymentConfirmed: number | null;
  confirmed: number | null;
  packed: number | null;
  packingPhotos: string[];
  delivered: number | null;
  deliveringPhotos: string[];
  deleted: number | null;
}
export interface IOrderContent {
  prices: IPrices;
  currency: Currency;
  products: OrderProduct[];
}
export interface IOrderDelivery {
  name: string;
  contact: string;
  placeType: PlaceType;
  place: string;
  placeAdd: string;
  date: number;
  deliveryType: DeliveryType;
  deliveryProduct: Delivery;
}

export type OrderDeliveryForm = Omit<IOrderDelivery, 'deliveryProduct'> & {
  deliveryProductId: string;
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
  total: IPrices;
  _created: number;
}

export enum Currency {
  Rub = 'rub',
  VND = 'vnd',
  USDT = 'usdt',
}

export enum Measure {
  KG = 'кг',
  Item = 'шт',
}

export type IPrices = Record<Currency, number>;

export enum ProductType {
  SimpleProduct,
  Set,
  Delivery,
  SetAddon,
  OrderAddon,
}

export type ProductBase = {
  id: string;
  type: ProductType;
  name: string;
  description: string;
  price: IPrices;
  deleted: boolean;
};

export type SimpleProduct = ProductBase & {
  weight: number;
  measure: Measure;
  amount: number;
  type: ProductType.SimpleProduct;
  products: ISetProducts;
};

export enum SetType {
  Fixed,
  MinPrice,
}

export type Set = ProductBase & {
  weight: number;
  type: ProductType.Set;
  setType: SetType;
  products: ISetProducts;
};

export type OrderProduct<T = Product> = T & {
  count: number;
  fixedCount?: number;
};

export type ISetProducts = Record<string, OrderProduct<SimpleProduct | Addon>>;

export enum DefaultAddonBy {
  None,
  Unconditional,
  Price,
  Count,
}

export type AddonBase = {
  default: DefaultAddonBy;
  minPrice: IPrices | null;
  minCount: number  | null;
};

export type Delivery = ProductBase &
  AddonBase & {
    type: ProductType.Delivery;
  };

  export type Addon = ProductBase & AddonBase & {
    type: ProductType.OrderAddon | ProductType.SetAddon;
    weight: number;
    amount: number;
    measure?: Measure;
  }

export type Product = SimpleProduct | Set | Addon | Delivery;
export type ProductForm =
  Omit<SimpleProduct, 'type'> &
  Omit<Set, 'type'> &
  Omit<Addon, 'type'> &
  Omit<Delivery, 'type' | 'minPrice' | 'minCount'> & {
    type: ProductType;
    minPrice: IPrices;
  minCount: number;
  };

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
  deleted: number | null;
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
  deleted: number | null;
}

export type ControlsOf<T> = {
  [K in keyof T]: T[K] extends Record<string, any>
    ? FormGroup<any>
    : FormControl<T[K]>;
};

export interface INewOrderInfo {
  order: IOrder;
  payment: IPayment;
}

export interface IConfig {
  cashierId: number;
  referralUrlBase: string;
}
