import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { historyProducts, productsMock } from '../../mock';
import { TInitialProductState } from '../../types';

const initialState: TInitialProductState = {
  items: productsMock,
  history: historyProducts,
  search: {
    items: productsMock,
    query: '',
  },
};

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setSearchQuery(state: TInitialProductState, action: PayloadAction<string>) {
      state.search.query = action.payload;
    },
    clearSearchQuery(state: TInitialProductState) {
      state.search.query = initialState.search.query;
    },
  },
});
export const productReducer = productSlice.reducer;
export const { setSearchQuery, clearSearchQuery } = productSlice.actions;
