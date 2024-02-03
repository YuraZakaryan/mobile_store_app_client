import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  createProductThunk,
  deleteProductThunk,
  fetchControlProductsThunk,
  fetchDiscountedProductsForHomeCategoryThunk,
  fetchDiscountedProductsThunk,
  fetchProductsByCategoryThunk,
  fetchProductsForHomeCategoryThunk,
  fetchProductsThunk,
  fetchProductThunk,
  searchProductsThunk,
  updateProductThunk,
} from '../../http/productThunk';
import { historyProducts } from '../../mock';
import { TInitialProductState, TItemsWithTotalLength, TProduct } from '../../types';

const initialState: TInitialProductState = {
  currentProduct: {
    product: null,
    isLoading: false,
    isError: false,
    isNetworkError: true,
  },
  products: {
    isLoading: false,
    isError: false,
    isNetworkError: true,
    total_items: 0,
    items: [],
  },
  productsControl: {
    isLoading: false,
    isError: false,
    isNetworkError: true,
    total_items: 0,
    items: [],
  },
  discountedProducts: {
    isLoading: false,
    isError: false,
    isNetworkError: true,
    total_items: 0,
    items: [],
  },
  productsForHomeScreen: {
    isLoading: false,
    isError: false,
    isNetworkError: true,
    total_items: 0,
    items: [],
  },
  discountedProductsForHomeScreen: {
    isLoading: false,
    isError: false,
    isNetworkError: true,
    total_items: 0,
    items: [],
  },
  productsByCategory: {
    isLoading: false,
    isError: false,
    isNetworkError: true,
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
  history: historyProducts,
  search: {
    isLoading: null,
    isError: false,
    isNetworkError: false,
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
    updateCurrentProduct(state: TInitialProductState, action: PayloadAction<TProduct | null>) {
      state.currentProduct.product = action.payload;
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
            isNetworkError: false,
            isLoading: false,
          };
        }
      )
      .addCase(fetchProductsThunk.pending, (state: TInitialProductState): void => {
        state.products.isLoading = true;
        state.products.isError = false;
        state.products.isNetworkError = false;
      })
      .addCase(fetchProductsThunk.rejected, (state: TInitialProductState): void => {
        state.products.total_items = 0;
        state.products.items = [];
        state.products.isLoading = false;
      })
      .addCase(
        fetchControlProductsThunk.fulfilled,
        (
          state: TInitialProductState,
          action: PayloadAction<TItemsWithTotalLength<TProduct[]>>
        ): void => {
          const { total_items, items } = action.payload;

          state.productsControl = {
            total_items,
            items,
            isError: false,
            isNetworkError: false,
            isLoading: false,
          };
        }
      )
      .addCase(fetchControlProductsThunk.pending, (state: TInitialProductState): void => {
        state.productsControl.isLoading = true;
        state.productsControl.isError = false;
        state.productsControl.isNetworkError = false;
      })
      .addCase(fetchControlProductsThunk.rejected, (state: TInitialProductState): void => {
        state.productsControl.total_items = 0;
        state.productsControl.items = [];
        state.productsControl.isLoading = false;
      })
      .addCase(fetchProductThunk.fulfilled, (state: TInitialProductState, action): void => {
        state.currentProduct = {
          product: action.payload as TProduct,
          isError: false,
          isLoading: false,
          isNetworkError: false,
        };
      })
      .addCase(fetchProductThunk.pending, (state: TInitialProductState): void => {
        state.currentProduct.isLoading = true;
        state.currentProduct.isError = false;
        state.currentProduct.isNetworkError = false;
      })
      .addCase(fetchProductThunk.rejected, (state: TInitialProductState, action): void => {
        state.currentProduct.isLoading = false;
        if (action.payload === 'NetworkError') {
          state.currentProduct.isNetworkError = true;
        } else if (action.payload !== 404) {
          state.currentProduct.isError = true;
        }
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
            isNetworkError: false,
            isLoading: false,
          };
        }
      )
      .addCase(fetchDiscountedProductsThunk.pending, (state: TInitialProductState): void => {
        state.discountedProducts.isLoading = true;
        state.discountedProducts.isError = false;
        state.discountedProducts.isNetworkError = false;
      })
      .addCase(
        fetchDiscountedProductsThunk.rejected,
        (state: TInitialProductState, action): void => {
          state.discountedProducts.total_items = 0;
          state.discountedProducts.items = [];
          state.discountedProducts.isLoading = false;
          if (action.payload === 'NetworkError') {
            state.discountedProducts.isNetworkError = true;
          } else if (action.payload !== 404) {
            state.discountedProducts.isError = true;
          }
        }
      )
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
            isNetworkError: false,
          };
        }
      )
      .addCase(fetchProductsForHomeCategoryThunk.pending, (state: TInitialProductState): void => {
        state.productsForHomeScreen.isLoading = true;
        state.productsForHomeScreen.isError = false;
        state.productsForHomeScreen.isNetworkError = false;
      })
      .addCase(
        fetchProductsForHomeCategoryThunk.rejected,
        (state: TInitialProductState, action): void => {
          state.productsForHomeScreen.total_items = 0;
          state.productsForHomeScreen.items = [];
          state.productsForHomeScreen.isLoading = false;
          if (action.payload === 'NetworkError') {
            state.productsForHomeScreen.isNetworkError = true;
          } else if (action.payload !== 404) {
            state.productsForHomeScreen.isError = true;
          }
        }
      )
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
            isNetworkError: false,
          };
        }
      )
      .addCase(
        fetchDiscountedProductsForHomeCategoryThunk.pending,
        (state: TInitialProductState): void => {
          state.discountedProductsForHomeScreen.isLoading = true;
          state.discountedProductsForHomeScreen.isError = false;
          state.discountedProductsForHomeScreen.isNetworkError = false;
        }
      )
      .addCase(
        fetchDiscountedProductsForHomeCategoryThunk.rejected,
        (state: TInitialProductState, action): void => {
          state.discountedProductsForHomeScreen.total_items = 0;
          state.discountedProductsForHomeScreen.items = [];
          state.discountedProductsForHomeScreen.isLoading = false;
          if (action.payload === 'NetworkError') {
            state.discountedProductsForHomeScreen.isNetworkError = true;
          } else if (action.payload !== 404) {
            state.discountedProductsForHomeScreen.isError = true;
          }
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
            isNetworkError: false,
            isLoading: false,
          };
        }
      )
      .addCase(searchProductsThunk.pending, (state: TInitialProductState): void => {
        state.search.isLoading = true;
        state.search.isError = false;
        state.search.isNetworkError = false;
      })
      .addCase(searchProductsThunk.rejected, (state: TInitialProductState, action): void => {
        state.search.total_items = 0;
        state.search.items = [];
        state.search.isLoading = false;
        if (action.payload === 'NetworkError') {
          state.search.isNetworkError = true;
        } else if (action.payload !== 404) {
          state.search.isError = true;
        }
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
            isNetworkError: false,
          };
        }
      )
      .addCase(fetchProductsByCategoryThunk.pending, (state: TInitialProductState): void => {
        state.productsByCategory.isLoading = true;
        state.productsByCategory.isError = false;
        state.productsByCategory.isNetworkError = false;
      })
      .addCase(
        fetchProductsByCategoryThunk.rejected,
        (state: TInitialProductState, action): void => {
          state.productsByCategory.total_items = 0;
          state.productsByCategory.items = [];
          state.productsByCategory.isLoading = false;
          if (action.payload === 'NetworkError') {
            state.productsByCategory.isNetworkError = true;
          } else if (action.payload !== 404) {
            state.productsByCategory.isError = true;
          }
        }
      )
      .addCase(createProductThunk.fulfilled, (state: TInitialProductState): void => {
        state.create.isLoading = false;
      })
      .addCase(createProductThunk.pending, (state: TInitialProductState): void => {
        state.create.isLoading = true;
      })
      .addCase(createProductThunk.rejected, (state: TInitialProductState): void => {
        state.create.isLoading = false;
      })
      .addCase(updateProductThunk.fulfilled, (state: TInitialProductState): void => {
        state.update.isLoading = false;
      })
      .addCase(updateProductThunk.pending, (state: TInitialProductState): void => {
        state.update.isLoading = true;
      })
      .addCase(updateProductThunk.rejected, (state: TInitialProductState): void => {
        state.update.isLoading = false;
      })
      .addCase(deleteProductThunk.fulfilled, (state: TInitialProductState): void => {
        state.delete.isLoading = false;
      })
      .addCase(deleteProductThunk.pending, (state: TInitialProductState): void => {
        state.delete.isLoading = true;
      })
      .addCase(deleteProductThunk.rejected, (state: TInitialProductState): void => {
        state.delete.isLoading = false;
      });
  },
});
export const productReducer = productSlice.reducer;
export const { setSearchQuery, clearSearchQuery, updateCurrentProduct } = productSlice.actions;
