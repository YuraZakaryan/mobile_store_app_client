import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  createCategoryThunk,
  deleteCategoryThunk,
  fetchCategoriesThunk,
  fetchControlCategoriesThunk,
  updateCategoryThunk,
  updateProductsCategoryByKeywordThunk,
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
  categoriesControl: {
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
  updateProductsCategoryByKeyword: {
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
      .addCase(
        fetchControlCategoriesThunk.fulfilled,
        (
          state: TInitialCategoryState,
          action: PayloadAction<TItemsWithTotalLength<TCategory[]>>
        ): void => {
          const { total_items, items } = action.payload;

          state.categoriesControl = {
            total_items,
            items,
            isError: false,
            isNetworkError: false,
            isLoading: false,
          };
        }
      )
      .addCase(fetchControlCategoriesThunk.pending, (state: TInitialCategoryState): void => {
        state.categoriesControl.isLoading = true;
        state.categoriesControl.isError = false;
        state.categoriesControl.isNetworkError = false;
      })
      .addCase(
        fetchControlCategoriesThunk.rejected,
        (state: TInitialCategoryState, action): void => {
          state.categoriesControl.total_items = 0;
          state.categoriesControl.items = [];
          state.categoriesControl.isLoading = false;
          if (action.payload === 'NetworkError') {
            state.categories.isNetworkError = true;
          } else if (action.payload !== 404) {
            state.categories.isError = true;
          }
        }
      )
      .addCase(createCategoryThunk.fulfilled, (state: TInitialCategoryState): void => {
        state.create.isLoading = false;
      })
      .addCase(createCategoryThunk.pending, (state: TInitialCategoryState): void => {
        state.create.isLoading = true;
      })
      .addCase(createCategoryThunk.rejected, (state: TInitialCategoryState): void => {
        state.create.isLoading = false;
      })
      .addCase(updateCategoryThunk.fulfilled, (state: TInitialCategoryState): void => {
        state.update.isLoading = false;
      })
      .addCase(updateCategoryThunk.pending, (state: TInitialCategoryState): void => {
        state.update.isLoading = true;
      })
      .addCase(updateCategoryThunk.rejected, (state: TInitialCategoryState): void => {
        state.update.isLoading = false;
      })
      .addCase(
        updateProductsCategoryByKeywordThunk.fulfilled,
        (state: TInitialCategoryState): void => {
          state.updateProductsCategoryByKeyword.isLoading = false;
        }
      )
      .addCase(
        updateProductsCategoryByKeywordThunk.pending,
        (state: TInitialCategoryState): void => {
          state.updateProductsCategoryByKeyword.isLoading = true;
        }
      )
      .addCase(
        updateProductsCategoryByKeywordThunk.rejected,
        (state: TInitialCategoryState): void => {
          state.updateProductsCategoryByKeyword.isLoading = false;
        }
      )
      .addCase(deleteCategoryThunk.fulfilled, (state: TInitialCategoryState): void => {
        state.delete.isLoading = false;
      })
      .addCase(deleteCategoryThunk.pending, (state: TInitialCategoryState): void => {
        state.delete.isLoading = true;
      })
      .addCase(deleteCategoryThunk.rejected, (state: TInitialCategoryState): void => {
        state.delete.isLoading = false;
      });
  },
});

export const categoryReducer = categorySlice.reducer;
export const { setCategory } = categorySlice.actions;
