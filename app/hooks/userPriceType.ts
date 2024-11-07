import { EPriceType } from '../redux/types';

export const usePriceType = (type: EPriceType) => {
  const checkPriceType: Record<EPriceType, 'priceRetail' | 'priceWholesale'> = {
    [EPriceType.RETAIL]: 'priceRetail',
    [EPriceType.WHOLESALE]: 'priceWholesale',
  };

  const priceKey = checkPriceType[type];

  return { priceKey };
};
