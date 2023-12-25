import { TProduct } from '../../redux/types';

const filterProductsLastDays = (products: TProduct[]): TProduct[] => {
  return products.slice(0, 6);
};
const filterItemsByDiscount = (products: TProduct[]): TProduct[] => {
  return products.filter((item: TProduct) => item.discount !== 0);
};
export { filterProductsLastDays, filterItemsByDiscount };
