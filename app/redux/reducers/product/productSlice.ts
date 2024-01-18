import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SHOW_ERROR, SHOW_SUCCESS } from '../../../toasts';
import {
  createProductThunk,
  deleteProductThunk,
  fetchDiscountedProductsForHomeCategoryThunk,
  fetchDiscountedProductsThunk,
  fetchProductsByCategoryThunk,
  fetchProductsForHomeCategoryThunk,
  fetchProductsThunk,
  searchProductsThunk,
  updateProductThunk,
} from '../../http/productThunk';
import { historyProducts } from '../../mock';
import { TInitialProductState, TItemsWithTotalLength, TProduct } from '../../types';

const initialState: TInitialProductState = {
  products: {
    isLoading: false,
    isError: false,
    total_items: 0,
    items: [],
  },
  discountedProducts: {
    isLoading: false,
    isError: false,
    total_items: 0,
    items: [],
  },
  productsForHomeScreen: {
    isLoading: false,
    isError: false,
    total_items: 0,
    items: [],
  },
  discountedProductsForHomeScreen: {
    isLoading: false,
    isError: false,
    total_items: 0,
    items: [],
  },
  productsByCategory: {
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
  history: historyProducts,
  search: {
    isLoading: false,
    isError: false,
    total_items: 0,
    items: [],
  },
  searchQuery: '',
};

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setSearchQuery(state: TInitialProductState, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    clearSearchQuery(state: TInitialProductState) {
      state.searchQuery = initialState.searchQuery;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchProductsThunk.fulfilled,
        (
          state: TInitialProductState,
          action: PayloadAction<TItemsWithTotalLength<TProduct[]>>
        ): void => {
          const { total_items, items } = action.payload;

          state.products = {
            total_items,
            items,
            isError: false,
            isLoading: false,
          };
        }
      )
      .addCase(fetchProductsThunk.pending, (state: TInitialProductState): void => {
        state.products.isLoading = true;
        state.products.isError = false;
      })
      .addCase(fetchProductsThunk.rejected, (state: TInitialProductState): void => {
        state.products.isLoading = false;
        state.products.isError = true;
      })
      .addCase(
        fetchDiscountedProductsThunk.fulfilled,
        (
          state: TInitialProductState,
          action: PayloadAction<TItemsWithTotalLength<TProduct[]>>
        ): void => {
          const { total_items, items } = action.payload;

          state.discountedProducts = {
            total_items,
            items,
            isError: false,
            isLoading: false,
          };
        }
      )
      .addCase(fetchDiscountedProductsThunk.pending, (state: TInitialProductState): void => {
        state.discountedProducts.isLoading = true;
        state.discountedProducts.isError = false;
      })
      .addCase(fetchDiscountedProductsThunk.rejected, (state: TInitialProductState): void => {
        state.discountedProducts.isLoading = false;
        state.discountedProducts.isError = true;
      })
      .addCase(
        fetchProductsForHomeCategoryThunk.fulfilled,
        (
          state: TInitialProductState,
          action: PayloadAction<TItemsWithTotalLength<TProduct[]>>
        ): void => {
          const { total_items, items } = action.payload;

          state.productsForHomeScreen = {
            total_items,
            items,
            isError: false,
            isLoading: false,
          };
        }
      )
      .addCase(fetchProductsForHomeCategoryThunk.pending, (state: TInitialProductState): void => {
        state.productsForHomeScreen.isLoading = true;
        state.productsForHomeScreen.isError = false;
      })
      .addCase(fetchProductsForHomeCategoryThunk.rejected, (state: TInitialProductState): void => {
        state.productsForHomeScreen.isLoading = false;
        state.productsForHomeScreen.isError = true;
      })
      .addCase(
        fetchDiscountedProductsForHomeCategoryThunk.fulfilled,
        (
          state: TInitialProductState,
          action: PayloadAction<TItemsWithTotalLength<TProduct[]>>
        ): void => {
          const { total_items, items } = action.payload;

          state.discountedProductsForHomeScreen = {
            total_items,
            items,
            isError: false,
            isLoading: false,
          };
        }
      )
      .addCase(
        fetchDiscountedProductsForHomeCategoryThunk.pending,
        (state: TInitialProductState): void => {
          state.discountedProductsForHomeScreen.isLoading = true;
          state.discountedProductsForHomeScreen.isError = false;
        }
      )
      .addCase(
        fetchDiscountedProductsForHomeCategoryThunk.rejected,
        (state: TInitialProductState): void => {
          state.discountedProductsForHomeScreen.isLoading = false;
          state.discountedProductsForHomeScreen.isError = true;
        }
      )
      .addCase(
        searchProductsThunk.fulfilled,
        (
          state: TInitialProductState,
          action: PayloadAction<TItemsWithTotalLength<TProduct[]>>
        ): void => {
          const { total_items, items } = action.payload;

          state.search = {
            total_items,
            items,
            isError: false,
            isLoading: false,
          };
        }
      )
      .addCase(searchProductsThunk.pending, (state: TInitialProductState): void => {
        state.search.isLoading = true;
        state.search.isError = false;
      })
      .addCase(searchProductsThunk.rejected, (state: TInitialProductState): void => {
        state.search.isLoading = false;
        state.search.isError = true;
      })
      .addCase(
        fetchProductsByCategoryThunk.fulfilled,
        (
          state: TInitialProductState,
          action: PayloadAction<TItemsWithTotalLength<TProduct[]>>
        ): void => {
          const { total_items, items } = action.payload;

          state.productsByCategory = {
            total_items,
            items,
            isError: false,
            isLoading: false,
          };
        }
      )
      .addCase(fetchProductsByCategoryThunk.pending, (state: TInitialProductState): void => {
        state.productsByCategory.isLoading = true;
        state.productsByCategory.isError = false;
      })
      .addCase(fetchProductsByCategoryThunk.rejected, (state: TInitialProductState): void => {
        state.productsByCategory.isLoading = false;
        state.productsByCategory.isError = true;
        state.productsByCategory.items = initialState.productsByCategory.items;
      })
      .addCase(
        createProductThunk.fulfilled,
        (state: TInitialProductState, action: PayloadAction<TProduct>): void => {
          state.create.isError = false;
          state.create.isLoading = false;
          SHOW_SUCCESS('Ապրանքը հաջողությամբ ստեղծվեց');
        }
      )
      .addCase(createProductThunk.pending, (state: TInitialProductState): void => {
        state.create.isError = false;
        state.create.isLoading = true;
      })
      .addCase(createProductThunk.rejected, (state: TInitialProductState): void => {
        state.create.isError = true;
        state.create.isLoading = false;
        SHOW_ERROR('Ապրանքի ստեղծման հետ կապված խնդիր է առաջացել');
      })
      .addCase(
        updateProductThunk.fulfilled,
        (state: TInitialProductState, action: PayloadAction<TProduct>): void => {
          state.update.isError = false;
          state.update.isLoading = false;
          SHOW_SUCCESS('Ապրանքը հաջողությամբ փոփոխվեց');
        }
      )
      .addCase(updateProductThunk.pending, (state: TInitialProductState): void => {
        state.update.isError = false;
        state.update.isLoading = true;
      })
      .addCase(updateProductThunk.rejected, (state: TInitialProductState): void => {
        state.update.isError = true;
        state.update.isLoading = false;
        SHOW_ERROR('Ապրանքի փոփոխման հետ կապված խնդիր է առաջացել');
      })
      .addCase(deleteProductThunk.fulfilled, (state: TInitialProductState): void => {
        state.delete.isError = false;
        state.delete.isLoading = false;
        SHOW_SUCCESS('Ապրանքը հաջողությամբ ջնջվեց');
      })
      .addCase(deleteProductThunk.pending, (state: TInitialProductState): void => {
        state.delete.isError = false;
        state.delete.isLoading = true;
      })
      .addCase(deleteProductThunk.rejected, (state: TInitialProductState): void => {
        state.delete.isError = true;
        state.delete.isLoading = false;
        SHOW_ERROR('Ապրանքի ջնջման հետ կապված խնդիր է առաջացել');
      });
  },
});
export const productReducer = productSlice.reducer;
export const { setSearchQuery, clearSearchQuery } = productSlice.actions;
