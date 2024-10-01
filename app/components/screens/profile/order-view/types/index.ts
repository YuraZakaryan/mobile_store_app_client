import { EOrderStatus, TOrder } from '../../../../../redux/types/order';

export interface TOrderViewRouteParams {
  item?: TOrder;
}
export interface IButtonStatusViewOrder {
  label: string;
  type: EOrderStatus;
  isLoading?: boolean;
  isDisable?: boolean;
  handleChangeStatus: (status: EOrderStatus) => void;
}

[
  {
    name: 'USB CABLE TYPE C REMAX C RC050 BLACK$',
    id: '66dc1578b60cc8cbc0394ad8',
    code: '6954851261360',
    stocks: [
      {
        id: '7e823bba-99b1-11ee-0a80-0f640010d798',
        name: 'KAYARAN',
        pathName: 'BIG STORE',
        code: '3004',
        address: '',
        externalCode: '-cf2pnWvhMzbdc9dHzzQm0',
        count: 2,
      },
    ],
  },
  {
    name: 'GREEN LION BEARD TRIMMER ONE BLADE',
    id: '66dc1525b60cc8cbc038ceca',
    code: '6935100181134',
    stocks: [
      {
        id: '7e823bba-99b1-11ee-0a80-0f640010d798',
        name: 'KAYARAN',
        pathName: 'BIG STORE',
        code: '3004',
        address: '',
        externalCode: '-cf2pnWvhMzbdc9dHzzQm0',
        count: 7,
      },
    ],
  },
];

export type TStock = {
  id: string;
  name: string;
  pathName: string;
  code: string;
  address: string;
  externalCode: string;
  count: number;
};

export type TProductsWithStocks = {
  id: string;
  name: string;
  code: string;
  stocks: TStock[];
};
