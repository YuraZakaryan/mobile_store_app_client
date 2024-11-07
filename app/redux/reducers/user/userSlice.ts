import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SecureStoreService } from '../../../services';
import {
  cancelUserThunk,
  confirmOtpThunk,
  createUserThunk,
  fetchBannedUsers,
  fetchCounterPartiesThunk,
  fetchMe,
  fetchUnconfirmedUsers,
  fetchUser,
  fetchUsersThunk,
  loginThunk,
  registrationThunk,
  resetPasswordThunk,
  sendOtpToMailThunk,
  toggleBanThunk,
  updatePasswordThunk,
  updateUserThunk,
} from '../../http/userThunk';
import {
  EAuthMode,
  EResetPasswordMode,
  TCounterParty,
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
    isNetworkError: false,
    total_items: 0,
    items: [],
  },
  counterParties: {
    total_items: 0,
    items: [],
    isLoading: false,
    isError: false,
    isNetworkError: false,
  },
  counterpartiesSearch: {
    query: '',
  },
  unconfirmedUsers: {
    isLoading: false,
    isError: false,
    isNetworkError: false,
    total_items: 0,
    items: [],
  },
  bannedUsers: {
    isLoading: false,
    isError: false,
    isNetworkError: false,
    total_items: 0,
    items: [],
  },
  fetchMe: {
    isLoading: false,
    isError: false,
  },
  authMode: EAuthMode.LOGIN,
  resetPassword: {
    mode: EResetPasswordMode.MAIL_SECTION,
    mail: '',
    otp: '',
    isLoading: false,
    isError: false,
  },
  login: {
    isLoading: false,
  },
  registration: {
    isLoading: false,
  },
  createUser: {
    isLoading: false,
  },
  updateUser: {
    isLoading: false,
  },
  cancelUser: {
    isLoading: false,
  },
  banUser: {
    isLoading: false,
  },
  updatePassword: {
    isLoading: false,
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthMode(state: TInitialUserState, action: PayloadAction<EAuthMode>): void {
      state.authMode = action.payload;
    },
    clearResetPassword(state: TInitialUserState): void {
      state.resetPassword = initialState.resetPassword;
    },
    logOut: (state: TInitialUserState) => {
      SecureStoreService.deleteAccessToken();
      SecureStoreService.deleteRefreshToken();
      state = { ...initialState, isAuth: false };
      return state;
    },
    setCounterpartiesSearchQuery: (state: TInitialUserState, action: PayloadAction<string>) => {
      state.counterpartiesSearch.query = action.payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(
        loginThunk.fulfilled,
        (state: TInitialUserState, action: PayloadAction<TPayloadActionUser>): void => {
          const { user } = action.payload;
          state.user = user;
          state.isAuth = true;
          state.login = initialState.login;
        }
      )
      .addCase(loginThunk.pending, (state: TInitialUserState): void => {
        state.login.isLoading = true;
      })
      .addCase(loginThunk.rejected, (state: TInitialUserState): void => {
        state.login.isLoading = false;
      })
      .addCase(registrationThunk.fulfilled, (state: TInitialUserState): void => {
        state.registration = initialState.registration;
        state.authMode = EAuthMode.LOGIN;
      })
      .addCase(registrationThunk.pending, (state: TInitialUserState): void => {
        state.registration.isLoading = true;
      })
      .addCase(registrationThunk.rejected, (state: TInitialUserState): void => {
        state.registration.isLoading = false;
      })
      .addCase(
        fetchUsersThunk.fulfilled,
        (state: TInitialUserState, action: PayloadAction<TItemsWithTotalLength<TUser[]>>): void => {
          const { total_items, items } = action.payload;

          state.users = {
            total_items,
            items,
            isError: false,
            isNetworkError: false,
            isLoading: false,
          };
        }
      )
      .addCase(fetchUsersThunk.pending, (state: TInitialUserState): void => {
        state.users.isLoading = true;
        state.users.isError = false;
        state.users.isNetworkError = false;
      })
      .addCase(fetchUsersThunk.rejected, (state: TInitialUserState, action): void => {
        state.users.total_items = 0;
        state.users.items = [];
        state.users.isLoading = false;
        if (action.payload === 'NetworkError') {
          state.users.isNetworkError = true;
        } else if (action.payload !== 404) {
          state.users.isError = true;
        }
      })
      .addCase(
        fetchUnconfirmedUsers.fulfilled,
        (state: TInitialUserState, action: PayloadAction<TItemsWithTotalLength<TUser[]>>) => {
          const { total_items, items } = action.payload;

          state.unconfirmedUsers = {
            total_items,
            items,
            isError: false,
            isNetworkError: false,
            isLoading: false,
          };
        }
      )
      .addCase(fetchUnconfirmedUsers.pending, (state: TInitialUserState): void => {
        state.unconfirmedUsers.isLoading = true;
        state.unconfirmedUsers.isError = false;
        state.unconfirmedUsers.isNetworkError = false;
      })
      .addCase(fetchUnconfirmedUsers.rejected, (state: TInitialUserState, action): void => {
        state.unconfirmedUsers.total_items = 0;
        state.unconfirmedUsers.items = [];
        state.unconfirmedUsers.isLoading = false;
        if (action.payload === 'NetworkError') {
          state.unconfirmedUsers.isNetworkError = true;
        } else if (action.payload !== 404) {
          state.unconfirmedUsers.isError = true;
        }
      })
      .addCase(
        fetchBannedUsers.fulfilled,
        (state: TInitialUserState, action: PayloadAction<TItemsWithTotalLength<TUser[]>>) => {
          const { total_items, items } = action.payload;

          state.bannedUsers = {
            total_items,
            items,
            isError: false,
            isNetworkError: false,
            isLoading: false,
          };
        }
      )
      .addCase(fetchBannedUsers.pending, (state: TInitialUserState): void => {
        state.bannedUsers.isLoading = true;
        state.bannedUsers.isError = false;
        state.bannedUsers.isNetworkError = false;
      })
      .addCase(fetchBannedUsers.rejected, (state: TInitialUserState, action): void => {
        state.bannedUsers.total_items = 0;
        state.bannedUsers.items = [];
        state.bannedUsers.isLoading = false;
        if (action.payload === 'NetworkError') {
          state.bannedUsers.isNetworkError = true;
        } else if (action.payload !== 404) {
          state.bannedUsers.isError = true;
        }
      })
      .addCase(
        fetchCounterPartiesThunk.fulfilled,
        (
          state: TInitialUserState,
          action: PayloadAction<TItemsWithTotalLength<TCounterParty[]> & { page: number }>
        ): void => {
          const { total_items, items, page } = action.payload;

          if (page === 1) {
            // Если это первая страница, заменяем элементы
            state.counterParties = {
              total_items,
              items,
              isError: false,
              isNetworkError: false,
              isLoading: false,
            };
          } else {
            // Если это последующие страницы, объединяем и фильтруем уникальные элементы по id
            const uniqueItems = [...state.counterParties.items, ...items].filter(
              (item, index, self) => index === self.findIndex((t) => t.id === item.id) // Уникальные элементы по id
            );

            state.counterParties = {
              total_items,
              items: uniqueItems,
              isError: false,
              isNetworkError: false,
              isLoading: false,
            };
          }
        }
      )

      .addCase(fetchCounterPartiesThunk.pending, (state: TInitialUserState): void => {
        state.counterParties.isLoading = true;
        state.counterParties.isError = false;
        state.counterParties.isNetworkError = false;
      })
      .addCase(fetchCounterPartiesThunk.rejected, (state: TInitialUserState, action): void => {
        state.counterParties.total_items = 0;
        state.counterParties.items = [];
        state.counterParties.isLoading = false;
        if (action.payload === 'NetworkError') {
          state.counterParties.isNetworkError = true;
        } else if (action.payload !== 404) {
          state.counterParties.isError = true;
        }
      })
      .addCase(updateUserThunk.fulfilled, (state: TInitialUserState): void => {
        state.updateUser.isLoading = false;
      })
      .addCase(updateUserThunk.pending, (state: TInitialUserState): void => {
        state.updateUser.isLoading = true;
      })
      .addCase(updateUserThunk.rejected, (state: TInitialUserState): void => {
        state.updateUser.isLoading = false;
      })
      .addCase(updatePasswordThunk.fulfilled, (state: TInitialUserState): void => {
        state.updatePassword.isLoading = false;
      })
      .addCase(updatePasswordThunk.pending, (state: TInitialUserState): void => {
        state.updatePassword.isLoading = true;
      })
      .addCase(updatePasswordThunk.rejected, (state: TInitialUserState): void => {
        state.updatePassword.isLoading = false;
      })
      .addCase(sendOtpToMailThunk.fulfilled, (state: TInitialUserState, action): void => {
        if (action.payload) {
          state.resetPassword = {
            isLoading: false,
            isError: false,
            otp: '',
            mail: action.payload.mail,
            mode: EResetPasswordMode.OPT_SECTION,
          };
        }
      })
      .addCase(sendOtpToMailThunk.pending, (state: TInitialUserState): void => {
        state.resetPassword.isLoading = true;
      })
      .addCase(sendOtpToMailThunk.rejected, (state: TInitialUserState): void => {
        state.resetPassword.isLoading = false;
      })
      .addCase(confirmOtpThunk.fulfilled, (state: TInitialUserState, action): void => {
        state.resetPassword = {
          isLoading: false,
          isError: false,
          otp: action.payload.otp,
          mail: action.payload.mail,
          mode: EResetPasswordMode.NEW_PASS_SECTION,
        };
      })
      .addCase(confirmOtpThunk.pending, (state: TInitialUserState): void => {
        state.resetPassword.isLoading = true;
      })
      .addCase(confirmOtpThunk.rejected, (state: TInitialUserState): void => {
        state.resetPassword.isLoading = false;
      })
      .addCase(resetPasswordThunk.fulfilled, (state: TInitialUserState, action): void => {
        if (action.payload) {
          state.resetPassword = initialState.resetPassword;
        }
      })
      .addCase(resetPasswordThunk.pending, (state: TInitialUserState): void => {
        state.resetPassword.isLoading = true;
      })
      .addCase(resetPasswordThunk.rejected, (state: TInitialUserState): void => {
        state.resetPassword.isLoading = false;
      })
      .addCase(createUserThunk.fulfilled, (state: TInitialUserState): void => {
        state.createUser.isLoading = false;
      })
      .addCase(createUserThunk.pending, (state: TInitialUserState): void => {
        state.createUser.isLoading = true;
      })
      .addCase(createUserThunk.rejected, (state: TInitialUserState): void => {
        state.createUser.isLoading = false;
      })
      .addCase(cancelUserThunk.fulfilled, (state: TInitialUserState): void => {
        state.cancelUser.isLoading = false;
      })
      .addCase(cancelUserThunk.pending, (state: TInitialUserState): void => {
        state.cancelUser.isLoading = true;
      })
      .addCase(cancelUserThunk.rejected, (state: TInitialUserState): void => {
        state.cancelUser.isLoading = false;
      })
      .addCase(toggleBanThunk.fulfilled, (state: TInitialUserState): void => {
        state.banUser.isLoading = false;
      })
      .addCase(toggleBanThunk.pending, (state: TInitialUserState): void => {
        state.banUser.isLoading = true;
      })
      .addCase(toggleBanThunk.rejected, (state: TInitialUserState): void => {
        state.banUser.isLoading = false;
      })
      .addCase(
        fetchMe.fulfilled,
        (state: TInitialUserState, action: PayloadAction<TUser>): void => {
          state.user = action.payload;
          if (action.payload) {
            state.isAuth = true;
          }
          state.fetchMe.isLoading = false;
        }
      )
      .addCase(fetchMe.pending, (state: TInitialUserState): void => {
        state.fetchMe.isLoading = true;
      })
      .addCase(fetchMe.rejected, (state: TInitialUserState): void => {
        state.isAuth = false;
        state.user = null;
        state.fetchMe.isLoading = false;
      })
      .addCase(
        fetchUser.fulfilled,
        (state: TInitialUserState, action: PayloadAction<TUser>): void => {
          state.user = action.payload;
        }
      ),
});
export const userReducer = userSlice.reducer;
export const { setAuthMode, clearResetPassword, logOut, setCounterpartiesSearchQuery } =
  userSlice.actions;
