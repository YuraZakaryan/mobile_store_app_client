import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { categoryReducer } from './reducers/category/categorySlice';
import { orderReducer } from './reducers/order/orderSlice';
import { productReducer } from './reducers/product/productSlice';
import { userReducer } from './reducers/user/userSlice';

const rootReducer = combineReducers({
  user: userReducer,
  product: productReducer,
  category: categoryReducer,
  order: orderReducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  });
};
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
