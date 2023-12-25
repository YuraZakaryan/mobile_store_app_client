import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { basketReducer } from './reducers/basket/basketSlice';
import { categoryReducer } from './reducers/category/categorySlice';
import { productReducer } from './reducers/product/productSlice';
import { userReducer } from './reducers/user/userSlice';

const rootReducer = combineReducers({
  user: userReducer,
  product: productReducer,
  category: categoryReducer,
  basket: basketReducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
