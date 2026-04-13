import { DEFAULT_CURRENCY } from "../constants/constants";
import { Currency, IOrderContent, SimpleProduct, IUser, OrderProduct, ProductType, SetType } from "../models/models";

export function getTotal(orderContent: IOrderContent) {
  const newTotal = {
    [Currency.Rub]: 0,
    [Currency.VND]: 0,
    [Currency.USDT]: 0,
  }
  orderContent.products.forEach((product) => {
    if(product.type !== ProductType.Set || product.setType === SetType.Fixed){
      newTotal[Currency.Rub] += product.price[Currency.Rub];
      newTotal[Currency.VND] += product.price[Currency.VND];
      newTotal[Currency.USDT] += product.price[Currency.USDT];
    }
    if (product.type == ProductType.Set) {
      Object.values(product.products).forEach((product: OrderProduct<SimpleProduct>) => {
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

export function getMinimalDate() {
  const dayToSet = new Date();
  const after21 = new Date().getHours() > 21;
  dayToSet.setDate(dayToSet.getDate() + (after21 ? 2 : 1))
  return { string: dayToSet.toISOString().slice(0, 10), number: dayToSet.getTime() }
}
