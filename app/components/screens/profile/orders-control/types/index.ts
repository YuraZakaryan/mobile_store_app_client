import { ParamListBase } from '@react-navigation/native';

import { IBasketItem } from '../../../../../redux/types';

export type TOrderListNavigationProps = {
  item: IBasketItem[];
} & ParamListBase;
