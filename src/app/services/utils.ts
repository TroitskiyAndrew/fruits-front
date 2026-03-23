import { EXPRESS_DELIVERY } from "../constants/constants";
import { Currency, IOrderContent, ISimpleProduct, OrderProduct } from "../models/models";

export function getTotal(orderContent: IOrderContent){
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
    if (orderContent.expressDelivery) {
      newTotal[Currency.Rub] += EXPRESS_DELIVERY[Currency.Rub];
      newTotal[Currency.VND] += EXPRESS_DELIVERY[Currency.VND];
      newTotal[Currency.USDT] += EXPRESS_DELIVERY[Currency.USDT];
    }
    return newTotal;
}
