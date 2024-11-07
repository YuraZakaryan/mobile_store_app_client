import { TProduct } from '../../redux/types';
import { EOrderStatus } from '../../redux/types/order';

const filterProductsLastDays = (products: TProduct[]): TProduct[] => {
  return products.slice(0, 6);
};
const filterItemsByDiscount = (products: TProduct[]): TProduct[] => {
  return products.filter((item: TProduct) => item.discount !== 0);
};
const formattedPrice = (price: number) => {
  const roundedPrice = Math.floor(price);
  return roundedPrice.toLocaleString('en-US');
};

const calculateDiscountedPrice = (price: number, discount: number) => {
  return price - (price * discount) / 100;
};
const getOrderStatus = (status: EOrderStatus) => {
  return status === EOrderStatus.ORDERED
    ? 'Պատվիրված'
    : status === EOrderStatus.CONFIRMED
      ? 'Հաստատված'
      : status === EOrderStatus.COMPLETED
        ? 'Հաստատված պահոցի կողմից'
        : status === EOrderStatus.REJECTED
          ? 'Մերժված'
          : 'Ակտիվ';
};

const isDiscount = (percent: number) => {
  return percent > 0;
};

const categoryHome = {
  newProducts: 'Նոր տեսականի',
  discountProducts: 'Զեղչեր',
};
export {
  calculateDiscountedPrice,
  categoryHome,
  filterItemsByDiscount,
  filterProductsLastDays,
  formattedPrice,
  getOrderStatus,
  isDiscount,
};
