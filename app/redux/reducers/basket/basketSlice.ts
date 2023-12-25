import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { basketProducts, ordersMock, usersMock } from '../../mock';
import { EPacking, TInitialBasketState, TUpdateFieldAction } from '../../types';

const initialState: TInitialBasketState = {
  newItemForm: {
    _id: null,
    title: '',
    count: 0,
  },
  formData: {
    items: basketProducts,
    packaging: EPacking.BAG,
    necessaryNotes: '',
    user: usersMock[0],
    status: 'neutral',
    orderCompletedTime: '',
    orderStartTime: '',
    created_at: '',
  },
  orders: ordersMock,
};

const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    changeForm(state: TInitialBasketState, action: PayloadAction<TUpdateFieldAction>) {
      const { name, value } = action.payload;
      state.newItemForm = {
        ...state.newItemForm,
        [name]: value,
      };
    },
    setProductId(
      state: TInitialBasketState,
      action: PayloadAction<{ _id: string; title: string }>
    ) {
      const { _id, title } = action.payload;
      state.newItemForm = {
        ...state.newItemForm,
        _id,
        title,
        count: 0,
      };
    },
    setPackaging(state: TInitialBasketState, action: PayloadAction<EPacking>) {
      state.formData.packaging = action.payload;
    },
    setNecessaryNotes(state: TInitialBasketState, action: PayloadAction<string>) {
      state.formData.necessaryNotes = action.payload;
    },
  },
});
export const basketReducer = basketSlice.reducer;
export const { changeForm, setProductId, setPackaging, setNecessaryNotes } = basketSlice.actions;
