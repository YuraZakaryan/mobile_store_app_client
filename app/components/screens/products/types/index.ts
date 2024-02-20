import React from 'react';

import { TCategory } from '../../../../redux/types';

export interface IProductCategoryItem {
  item: TCategory;
  setProductCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}
