import { Currency, IOrderContent, ISimpleProduct, IUser, OrderProduct } from "../models/models";

export function getTotal(orderContent: IOrderContent) {
  const newTotal = {
    [Currency.Rub]: 0,
    [Currency.VND]: 0,
    [Currency.USDT]: 0,
  }
  orderContent.products.forEach((product) => {
    if (!product.set || product.fixedSet) {
      newTotal[Currency.Rub] += product.price[Currency.Rub];
      newTotal[Currency.VND] += product.price[Currency.VND];
      newTotal[Currency.USDT] += product.price[Currency.USDT];
    }
    if (product.set) {
      Object.values(product.products).forEach((product: OrderProduct<ISimpleProduct>) => {
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
      [Currency.Rub]: null,
      [Currency.VND]: null,
      [Currency.USDT]: null,
    }
  }
}


export function getUserName(user: IUser): string {
  const tgUser = user.user;
  return `${tgUser.first_name}${tgUser.last_name ? ' ' + tgUser.last_name : ''}`;
}
