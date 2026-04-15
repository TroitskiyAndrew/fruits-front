import { DEFAULT_CURRENCY } from "../constants/constants";
import { Currency, IOrderContent, SimpleProduct, IUser, OrderProduct, ProductType, SetType, Delivery, DefaultAddonBy, Addon, IPrices } from "../models/models";

export function getTotal(orderContent: IOrderContent) {
  const newTotal = {
    [Currency.Rub]: 0,
    [Currency.VND]: 0,
    [Currency.USDT]: 0,
  }
  orderContent.products.forEach((product) => {
    if (product.type !== ProductType.Set || product.setType === SetType.Fixed) {
      newTotal[Currency.Rub] += product.price[Currency.Rub];
      newTotal[Currency.VND] += product.price[Currency.VND];
      newTotal[Currency.USDT] += product.price[Currency.USDT];
    }
    if (product.type == ProductType.Set) {
      Object.values(product.products).forEach((product: OrderProduct<SimpleProduct | Addon>) => {
        newTotal[Currency.Rub] += product.price[Currency.Rub] * (product.count - (product.fixedCount || 0));
        newTotal[Currency.VND] += product.price[Currency.VND] * (product.count - (product.fixedCount || 0));
        newTotal[Currency.USDT] += product.price[Currency.USDT] * (product.count - (product.fixedCount || 0));
      })
    }
  });

  return newTotal;
}

export function getEmptyUser(): IUser {
  return {
    id: '',
    user: {
      id: 0,
      first_name: '',
    },
    userId: 0,
    pressedStart: false,
    admin: false,
    source: '',
    sources: [],
    path: [],
    _created: 0,
    sessionId: '',
    paymentMethods: {
      [Currency.Rub]: { bank: null, cash: false },
      [Currency.VND]: { bank: null, cash: false },
      [Currency.USDT]: { bank: null, cash: false },
    },
    currency: DEFAULT_CURRENCY
  }
}


export function getUserName(user: IUser): string {
  const tgUser = user.user;
  return `${tgUser.first_name}${tgUser.last_name ? ' ' + tgUser.last_name : ''}`;
}

export function getMinimalDate(express = false) {
  const dayToSet = new Date();
  const after21 = new Date().getHours() > 21;
  dayToSet.setDate(dayToSet.getDate() + (express ? 0 : (after21 ? 2 : 1)))
  return { string: dayToSet.toISOString().slice(0, 10), number: dayToSet.getTime() }
}


export function chooseDefaultDelivery(deliveries: Delivery[], currency: Currency, price: number, count: number): Delivery {
  let defaultOption: Delivery;
  const options = new Set(deliveries.map(delivery => delivery.default));
  const byCount = options.has(DefaultAddonBy.Count);
  const byPrice = options.has(DefaultAddonBy.Price);
  deliveries.forEach(delivery => {
    const hasTrigger =  byCount ? delivery.minCount != null : (byPrice ? delivery.minPrice : false)
    const trigger = byCount ? (delivery.minCount || 1000) : byPrice ? delivery.minPrice?.[currency] || 10000000 : 99999999999;
    const limit = byCount ? count : (byPrice ? price : 0)
    if (hasTrigger) {
      if (trigger <= limit) {
        defaultOption = delivery;
      }
    } else if (!defaultOption || (defaultOption?.minPrice == null && defaultOption?.minCount == null)) {
      defaultOption = delivery;
    }
  });
  return defaultOption!;

}

export function summPrices(prices: IPrices[]) {
  return prices.reduce((acc, price) => {
    acc[Currency.Rub] += price[Currency.Rub];
    acc[Currency.VND] += price[Currency.VND];
    acc[Currency.USDT] += price[Currency.USDT];
    return acc;
  }, {
    [Currency.Rub]: 0,
    [Currency.VND]: 0,
    [Currency.USDT]: 0,
   })
}

