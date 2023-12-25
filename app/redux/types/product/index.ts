export type TProduct = {
  _id: string;
  category: string;
  title: string;
  picture: string;
  price: number;
  code: number;
  discount: number;
  created_at: string;
};

export interface IProductHistory extends TProduct {
  orderCount: number;
}

export type TInitialProductState = {
  items: TProduct[];
  history: IProductHistory[];
  search: {
    items: TProduct[];
    query: string;
  };
};
