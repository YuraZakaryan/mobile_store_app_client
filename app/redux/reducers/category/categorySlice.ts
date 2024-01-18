import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SHOW_ERROR, SHOW_SUCCESS } from '../../../toasts';
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
    total_items: 0,
    items: [],
  },
  create: {
    isLoading: false,
    isError: false,
  },
  update: {
    isLoading: false,
    isError: false,
  },
  delete: {
    isLoading: false,
    isError: false,
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
            isLoading: false,
          };
        }
      )
      .addCase(fetchCategoriesThunk.pending, (state: TInitialCategoryState): void => {
        state.categories.isLoading = true;
        state.categories.isError = false;
      })
      .addCase(fetchCategoriesThunk.rejected, (state: TInitialCategoryState): void => {
        state.categories.isLoading = false;
        state.categories.isError = true;
      })
      .addCase(createCategoryThunk.fulfilled, (state: TInitialCategoryState): void => {
        state.create.isError = false;
        state.create.isLoading = false;
        SHOW_SUCCESS('Կատեգորիան հաջողությամբ ստեղծվեց');
      })
      .addCase(createCategoryThunk.pending, (state: TInitialCategoryState): void => {
        state.create.isError = false;
        state.create.isLoading = true;
      })
      .addCase(createCategoryThunk.rejected, (state: TInitialCategoryState): void => {
        state.create.isError = true;
        state.create.isLoading = false;
        SHOW_ERROR('Կատեգորիայի ստեղծման հետ կապված խնդիր է առաջացել');
      })
      .addCase(updateCategoryThunk.fulfilled, (state: TInitialCategoryState): void => {
        state.update.isError = false;
        state.update.isLoading = false;
        SHOW_SUCCESS('Կատեգորիան հաջողությամբ փոփոխվեց');
      })
      .addCase(updateCategoryThunk.pending, (state: TInitialCategoryState): void => {
        state.update.isError = false;
        state.update.isLoading = true;
      })
      .addCase(updateCategoryThunk.rejected, (state: TInitialCategoryState): void => {
        state.update.isError = true;
        state.update.isLoading = false;
        SHOW_ERROR('Կատեգորիայի փոփոխման հետ կապված խնդիր է առաջացել');
      })
      .addCase(deleteCategoryThunk.fulfilled, (state: TInitialCategoryState): void => {
        state.delete.isError = false;
        state.delete.isLoading = false;
      })
      .addCase(deleteCategoryThunk.pending, (state: TInitialCategoryState): void => {
        state.delete.isError = false;
        state.delete.isLoading = true;
      })
      .addCase(deleteCategoryThunk.rejected, (state: TInitialCategoryState, action): void => {
        state.delete.isError = true;
        state.delete.isLoading = false;
        if (action.payload) {
          if (action.payload === 409) {
            SHOW_ERROR('Հայտնաբերվել են ապրանքներ տվյալ կատեգորիայով');
          } else {
            SHOW_ERROR('Կատեգորիայի ջնջման հետ կապված խնդիր է առաջացել');
          }
        }
      });
  },
});

export const categoryReducer = categorySlice.reducer;
export const { setCategory } = categorySlice.actions;
