import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SHOW_ERROR, SHOW_SUCCESS } from '../../../toasts';
import { NETWORK_ERROR_MESSAGE } from '../../../utils/constants';
import {
  createCategoryThunk,
  deleteCategoryThunk,
  fetchCategoriesThunk,
  updateCategoryThunk,
} from '../../http/categoryThunk';
import { TCategory, TChosen, TInitialCategoryState, TItemsWithTotalLength } from '../../types';

const initialState: TInitialCategoryState = {
  categories: {
    isLoading: false,
    isError: false,
    isNetworkError: false,
    total_items: 0,
    items: [],
  },
  create: {
    isLoading: false,
  },
  update: {
    isLoading: false,
  },
  delete: {
    isLoading: false,
  },
  chosen: {
    _id: '',
    title: '',
  },
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategory(state: TInitialCategoryState, action: PayloadAction<TChosen>) {
      const { _id, title } = action.payload;
      state.chosen = {
        _id,
        title,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchCategoriesThunk.fulfilled,
        (
          state: TInitialCategoryState,
          action: PayloadAction<TItemsWithTotalLength<TCategory[]>>
        ): void => {
          const { total_items, items } = action.payload;

          state.categories = {
            total_items,
            items,
            isError: false,
            isNetworkError: false,
            isLoading: false,
          };
        }
      )
      .addCase(fetchCategoriesThunk.pending, (state: TInitialCategoryState): void => {
        state.categories.isLoading = true;
        state.categories.isError = false;
        state.categories.isNetworkError = false;
      })
      .addCase(fetchCategoriesThunk.rejected, (state: TInitialCategoryState, action): void => {
        state.categories.total_items = 0;
        state.categories.items = [];
        state.categories.isLoading = false;
        if (action.payload === 'NetworkError') {
          state.categories.isNetworkError = true;
        } else if (action.payload !== 404) {
          state.categories.isError = true;
        }
      })
      .addCase(createCategoryThunk.fulfilled, (state: TInitialCategoryState): void => {
        state.create.isLoading = false;
      })
      .addCase(createCategoryThunk.pending, (state: TInitialCategoryState): void => {
        state.create.isLoading = true;
      })
      .addCase(createCategoryThunk.rejected, (state: TInitialCategoryState, action): void => {
        state.create.isLoading = false;
        if (action.payload === 'NetworkError') {
          SHOW_ERROR(NETWORK_ERROR_MESSAGE);
        } else if (action.payload === 403) {
          SHOW_ERROR('Դուք չունեք բավարար իրավունքներ');
        } else {
          SHOW_ERROR('Կատեգորիայի ստեղծման հետ կապված խնդիր է առաջացել');
        }
      })
      .addCase(updateCategoryThunk.fulfilled, (state: TInitialCategoryState): void => {
        state.update.isLoading = false;
      })
      .addCase(updateCategoryThunk.pending, (state: TInitialCategoryState): void => {
        state.update.isLoading = true;
      })
      .addCase(updateCategoryThunk.rejected, (state: TInitialCategoryState, action): void => {
        state.update.isLoading = false;
        if (action.payload === 'NetworkError') {
          SHOW_ERROR(NETWORK_ERROR_MESSAGE);
        } else if (action.payload === 403) {
          SHOW_ERROR('Դուք չունեք բավարար իրավունքներ');
        } else {
          SHOW_ERROR('Կատեգորիայի փոփոխման հետ կապված խնդիր է առաջացել');
        }
      })
      .addCase(deleteCategoryThunk.fulfilled, (state: TInitialCategoryState): void => {
        state.delete.isLoading = false;
      })
      .addCase(deleteCategoryThunk.pending, (state: TInitialCategoryState): void => {
        state.delete.isLoading = true;
      })
      .addCase(deleteCategoryThunk.rejected, (state: TInitialCategoryState, action): void => {
        state.delete.isLoading = false;
        if (action.payload === 'NetworkError') {
          SHOW_ERROR(NETWORK_ERROR_MESSAGE);
        } else if (action.payload === 409) {
          SHOW_ERROR('Հայտնաբերվել են ապրանքներ տվյալ կատեգորիայով');
        } else if (action.payload === 403) {
          SHOW_ERROR('Դուք չունեք բավարար իրավունքներ');
        } else {
          SHOW_ERROR('Կատեգորիայի ջնջման հետ կապված խնդիր է առաջացել');
        }
      });
  },
});

export const categoryReducer = categorySlice.reducer;
export const { setCategory } = categorySlice.actions;
