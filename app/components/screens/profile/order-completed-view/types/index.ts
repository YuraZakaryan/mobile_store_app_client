import { TClassName } from '../../../../../types';

export interface IOrderInfoItem extends TClassName {
  label: string;
  text: string | number;
  textClassName?: string;
}
