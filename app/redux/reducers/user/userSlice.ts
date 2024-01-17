import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SecureStoreService } from '../../../services';
import { SHOW_ERROR, SHOW_SUCCESS } from '../../../toasts';
import {
  cancelUserThunk,
  createUserThunk,
  fetchBannedUsers,
  fetchMe,
  fetchUnconfirmedUsers,
  fetchUsersThunk,
  loginThunk,
  registrationThunk,
  toggleBanThunk,
  updatePasswordThunk,
  updateUserThunk,
} from '../../http/userThunk';
import {
  EAuthMode,
  TInitialUserState,
  TItemsWithTotalLength,
  TPayloadActionUser,
  TUser,
} from '../../types';

const initialState: TInitialUserState = {
  isAuth: null,
  user: null,
  users: {
    isLoading: false,
    isError: false,
    total_items: 0,
    items: [],
  },
  unconfirmedUsers: { isLoading: false, isError: false, total_items: 0, items: [] },
  bannedUsers: { isLoading: false, isError: false, total_items: 0, items: [] },
  fetchMe: {
    isLoading: false,
    isError: false,
  },
  authMode: EAuthMode.LOGIN,
  login: {
    isLoading: false,
    isError: false,
  },
  registration: {
    isLoading: false,
    isError: false,
  },
  createUser: {
    isLoading: false,
    isError: false,
  },
  updateUser: {
    isLoading: false,
    isError: false,
  },
  cancelUser: {
    isLoading: false,
    isError: false,
  },
  banUser: {
    isLoading: false,
    isError: false,
  },
  updatePassword: {
    isLoading: false,
    isError: false,
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthMode(state: TInitialUserState, action: PayloadAction<EAuthMode>) {
      state.authMode = action.payload;
    },
    logOut: (state: TInitialUserState) => {
      SecureStoreService.deleteAccessToken();
      SecureStoreService.deleteRefreshToken();
      state = { ...initialState, isAuth: false };
      return state;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(
        loginThunk.fulfilled,
        (state: TInitialUserState, action: PayloadAction<TPayloadActionUser>) => {
          const { user } = action.payload;
          state.user = user;
          state.isAuth = true;
          state.login = initialState.login;
        }
      )
      .addCase(loginThunk.pending, (state: TInitialUserState): void => {
        state.login.isLoading = true;
        state.login.isError = false;
      })
      .addCase(loginThunk.rejected, (state: TInitialUserState): void => {
        state.login.isLoading = false;
        state.login.isError = true;
        SHOW_ERROR('Մուտքանունը կամ գաղտնաբառը սխալ է');
      })
      .addCase(
        registrationThunk.fulfilled,
        (state: TInitialUserState, action: PayloadAction<TPayloadActionUser>) => {
          const { user } = action.payload;
          state.user = user;
          state.isAuth = true;
          state.registration = initialState.registration;
        }
      )
      .addCase(registrationThunk.pending, (state: TInitialUserState): void => {
        state.registration.isLoading = true;
        state.registration.isError = false;
      })
      .addCase(registrationThunk.rejected, (state: TInitialUserState): void => {
        state.registration.isLoading = false;
        state.registration.isError = true;
        SHOW_ERROR('Մուտքանունը զբաղված է, խնդրում ենք փորձել մեկ ուրիշ');
      })
      .addCase(
        fetchUsersThunk.fulfilled,
        (state: TInitialUserState, action: PayloadAction<TItemsWithTotalLength<TUser[]>>) => {
          const { total_items, items } = action.payload;

          state.users = {
            total_items,
            items,
            isError: false,
            isLoading: false,
          };
        }
      )
      .addCase(fetchUsersThunk.pending, (state: TInitialUserState): void => {
        state.users.isLoading = true;
        state.users.isError = false;
      })
      .addCase(fetchUsersThunk.rejected, (state: TInitialUserState): void => {
        state.users.isLoading = false;
        state.users.isError = true;
      })
      .addCase(
        fetchUnconfirmedUsers.fulfilled,
        (state: TInitialUserState, action: PayloadAction<TItemsWithTotalLength<TUser[]>>) => {
          const { total_items, items } = action.payload;

          state.unconfirmedUsers = {
            total_items,
            items,
            isError: false,
            isLoading: false,
          };
        }
      )
      .addCase(fetchUnconfirmedUsers.pending, (state: TInitialUserState): void => {
        state.unconfirmedUsers.isLoading = true;
        state.unconfirmedUsers.isError = false;
      })
      .addCase(fetchUnconfirmedUsers.rejected, (state: TInitialUserState): void => {
        state.unconfirmedUsers.isLoading = false;
        state.unconfirmedUsers.isError = true;
      })
      .addCase(
        fetchBannedUsers.fulfilled,
        (state: TInitialUserState, action: PayloadAction<TItemsWithTotalLength<TUser[]>>) => {
          const { total_items, items } = action.payload;

          state.bannedUsers = {
            total_items,
            items,
            isError: false,
            isLoading: false,
          };
        }
      )
      .addCase(fetchBannedUsers.pending, (state: TInitialUserState): void => {
        state.bannedUsers.isLoading = true;
        state.bannedUsers.isError = false;
      })
      .addCase(fetchBannedUsers.rejected, (state: TInitialUserState): void => {
        state.bannedUsers.isLoading = false;
        state.bannedUsers.isError = true;
      })
      .addCase(
        updateUserThunk.fulfilled,
        (state: TInitialUserState, action: PayloadAction<TUser>): void => {
          state.updateUser.isError = false;
          state.updateUser.isLoading = false;

          const userIndex: number = state.users.items.findIndex(
            (user: TUser): boolean => user._id === action.payload._id
          );
          if (userIndex !== -1) {
            state.users.items[userIndex] = action.payload;
          } else {
            state.unconfirmedUsers.items = state.unconfirmedUsers.items.filter(
              (item: TUser): boolean => item._id !== action.payload._id
            );
            state.users.items.push(action.payload);
          }

          SHOW_SUCCESS('Բաժանորդի տվյալները հաջողությամբ փոխվեցին');
        }
      )
      .addCase(updateUserThunk.pending, (state: TInitialUserState): void => {
        state.updateUser.isError = false;
        state.updateUser.isLoading = true;
      })
      .addCase(updateUserThunk.rejected, (state: TInitialUserState): void => {
        state.updateUser.isError = true;
        state.updateUser.isLoading = false;
        SHOW_ERROR('Բաժանորդի տվյալների փոփոխման հետ  կապված խնդիր է առաջացել');
      })
      .addCase(updatePasswordThunk.fulfilled, (state: TInitialUserState): void => {
        state.updatePassword.isError = false;
        state.updatePassword.isLoading = false;

        SHOW_SUCCESS('Գաղտնաբառը հաջողությամբ փոխվեց');
      })
      .addCase(updatePasswordThunk.pending, (state: TInitialUserState): void => {
        state.updatePassword.isError = false;
        state.updatePassword.isLoading = true;
      })
      .addCase(updatePasswordThunk.rejected, (state: TInitialUserState, action): void => {
        state.updatePassword.isError = true;
        state.updatePassword.isLoading = false;
        if (action.payload === 400) {
          SHOW_ERROR('Հին գաղտնաբառը սխալ է');
        }
      })
      .addCase(createUserThunk.fulfilled, (state: TInitialUserState): void => {
        state.createUser.isError = false;
        state.createUser.isLoading = false;
        SHOW_SUCCESS('Բաժանորդի հաջողությամբ ստեղծվեց');
      })
      .addCase(createUserThunk.pending, (state: TInitialUserState): void => {
        state.createUser.isError = false;
        state.createUser.isLoading = true;
      })
      .addCase(createUserThunk.rejected, (state: TInitialUserState): void => {
        state.createUser.isError = true;
        state.createUser.isLoading = false;
        SHOW_ERROR('Բաժանորդի ստեղծման հետ կապված խնդիր է առաջացել');
      })
      .addCase(cancelUserThunk.fulfilled, (state: TInitialUserState): void => {
        state.cancelUser.isError = false;
        state.cancelUser.isLoading = false;
        SHOW_SUCCESS('Բաժանորդը հաջողությամբ չեղարկվեց');
      })
      .addCase(cancelUserThunk.pending, (state: TInitialUserState): void => {
        state.cancelUser.isError = false;
        state.cancelUser.isLoading = true;
      })
      .addCase(cancelUserThunk.rejected, (state: TInitialUserState): void => {
        state.cancelUser.isError = true;
        state.cancelUser.isLoading = false;
        SHOW_ERROR('Բաժանորդի չեղարկման հետ կապված խնդիր է առաջացել');
      })
      .addCase(
        toggleBanThunk.fulfilled,
        (state: TInitialUserState, action: PayloadAction<{ message: string }>): void => {
          state.banUser.isError = false;
          state.banUser.isLoading = false;
          SHOW_SUCCESS(
            `${
              action.payload.message === 'User banned'
                ? 'Բաժանորդը հաջողությամբ ապաակտիվացվեց'
                : 'Բաժանորդը հաջողությամբ ակտիվացվեց'
            }`
          );
        }
      )
      .addCase(toggleBanThunk.pending, (state: TInitialUserState): void => {
        state.banUser.isError = false;
        state.banUser.isLoading = true;
      })
      .addCase(toggleBanThunk.rejected, (state: TInitialUserState): void => {
        state.banUser.isError = true;
        state.banUser.isLoading = false;
        SHOW_ERROR('Բաժանորդի ակտիվացման կամ ապաակտիվացման հետ կապված խնդիր է առաջացել');
      })
      .addCase(
        fetchMe.fulfilled,
        (state: TInitialUserState, action: PayloadAction<TUser>): void => {
          state.user = action.payload;       
          if(action.payload) {
            state.isAuth = true;
          }             
          state.fetchMe.isError = false;
          state.fetchMe.isLoading = false;
        }
      )
      .addCase(fetchMe.pending, (state: TInitialUserState): void => {
        state.fetchMe.isError = false;
        state.fetchMe.isLoading = true;
      })
      .addCase(fetchMe.rejected, (state: TInitialUserState): void => {
        state.isAuth = false;
        state.fetchMe.isError = true;
        state.fetchMe.isLoading = false;
      }),
});
export const userReducer = userSlice.reducer;
export const { setAuthMode, logOut } = userSlice.actions;
