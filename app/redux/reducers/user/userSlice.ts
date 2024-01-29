import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SecureStoreService } from '../../../services';
import { SHOW_ERROR, SHOW_SUCCESS } from '../../../toasts';
import { NETWORK_ERROR_MESSAGE } from '../../../utils/constants';
import {
  cancelUserThunk,
  confirmOtpThunk,
  createUserThunk,
  fetchBannedUsers,
  fetchMe,
  fetchUnconfirmedUsers,
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
    setResetPasswordMode(
      state: TInitialUserState,
      action: PayloadAction<EResetPasswordMode>
    ): void {
      state.resetPassword.mode = action.payload;
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
      })
      .addCase(loginThunk.rejected, (state: TInitialUserState, action): void => {
        state.login.isLoading = false;
        if (action.payload === 'NetworkError') {
          SHOW_ERROR(NETWORK_ERROR_MESSAGE);
        } else {
          SHOW_ERROR('Մուտքանունը կամ գաղտնաբառը սխալ է');
        }
      })
      .addCase(
        registrationThunk.fulfilled,
        (state: TInitialUserState, action: PayloadAction<TPayloadActionUser>): void => {
          const { user } = action.payload;
          state.user = user;
          state.isAuth = true;
          state.registration = initialState.registration;
        }
      )
      .addCase(registrationThunk.pending, (state: TInitialUserState): void => {
        state.registration.isLoading = true;
      })
      .addCase(registrationThunk.rejected, (state: TInitialUserState, action): void => {
        state.registration.isLoading = false;
        if (action.payload === 'NetworkError') {
          SHOW_ERROR(NETWORK_ERROR_MESSAGE);
        } else {
          SHOW_ERROR('Մուտքանունը զբաղված է, խնդրում ենք փորձել մեկ ուրիշ');
        }
      })
      .addCase(
        fetchUsersThunk.fulfilled,
        (state: TInitialUserState, action: PayloadAction<TItemsWithTotalLength<TUser[]>>) => {
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
      .addCase(updateUserThunk.fulfilled, (state: TInitialUserState): void => {
        state.updateUser.isLoading = false;
      })
      .addCase(updateUserThunk.pending, (state: TInitialUserState): void => {
        state.updateUser.isLoading = true;
      })
      .addCase(updateUserThunk.rejected, (state: TInitialUserState, action): void => {
        state.updateUser.isLoading = false;
        if (action.payload === 'NetworkError') {
          SHOW_ERROR(NETWORK_ERROR_MESSAGE);
        } else {
          SHOW_ERROR('Բաժանորդի տվյալների փոփոխման հետ  կապված խնդիր է առաջացել');
        }
      })
      .addCase(updatePasswordThunk.fulfilled, (state: TInitialUserState): void => {
        state.updatePassword.isLoading = false;
        SHOW_SUCCESS('Գաղտնաբառը հաջողությամբ փոխվեց');
      })
      .addCase(updatePasswordThunk.pending, (state: TInitialUserState): void => {
        state.updatePassword.isLoading = true;
      })
      .addCase(updatePasswordThunk.rejected, (state: TInitialUserState, action): void => {
        state.updatePassword.isLoading = false;
        if (action.payload === 'NetworkError') {
          SHOW_ERROR(NETWORK_ERROR_MESSAGE);
        } else if (action.payload === 400) {
          SHOW_ERROR('Հին գաղտնաբառը սխալ է');
        }
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
      .addCase(sendOtpToMailThunk.rejected, (state: TInitialUserState, action): void => {
        state.resetPassword.isLoading = false;
        if (action.payload === 'NetworkError') {
          SHOW_ERROR(NETWORK_ERROR_MESSAGE);
        } else {
          SHOW_ERROR('Նշված էլեկտրոնային փոստով բաժանորդ չի գտնվել');
        }
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
      .addCase(confirmOtpThunk.rejected, (state: TInitialUserState, action): void => {
        state.resetPassword.isLoading = false;
        if (action.payload === 'NetworkError') {
          SHOW_ERROR(NETWORK_ERROR_MESSAGE);
        } else if (action.payload === 410) {
          SHOW_ERROR('Նշված մեկ անգամյա գաղտմաբառը այլևս վավեր չէ, խնդրում ենք պահանջել նորը');
        } else if (action.payload === 403) {
          SHOW_ERROR('Սխալ մեկ անգամյա գաղտնաբառ');
        }
      })
      .addCase(resetPasswordThunk.fulfilled, (state: TInitialUserState, action): void => {
        if (action.payload) {
          state.resetPassword = initialState.resetPassword;
          SHOW_SUCCESS('Գաղտնաբառը հաջողությամբ փոխվեց');
        }
      })
      .addCase(resetPasswordThunk.pending, (state: TInitialUserState): void => {
        state.resetPassword.isLoading = true;
      })
      .addCase(resetPasswordThunk.rejected, (state: TInitialUserState, action): void => {
        state.resetPassword.isLoading = false;
        if (action.payload === 'NetworkError') {
          SHOW_ERROR(NETWORK_ERROR_MESSAGE);
        } else if (action.payload === 404) {
          SHOW_ERROR('Այս էլ․ փոստով բաժանորդ չի գտնվել');
        } else if (action.payload === 403) {
          SHOW_ERROR('Սխալ մեկ անգամյա գաղտնաբառ');
        }
      })
      .addCase(createUserThunk.fulfilled, (state: TInitialUserState): void => {
        state.createUser.isLoading = false;
      })
      .addCase(createUserThunk.pending, (state: TInitialUserState): void => {
        state.createUser.isLoading = true;
      })
      .addCase(createUserThunk.rejected, (state: TInitialUserState, action): void => {
        state.createUser.isLoading = false;
        if (action.payload === 'NetworkError') {
          SHOW_ERROR(NETWORK_ERROR_MESSAGE);
        } else {
          SHOW_ERROR('Բաժանորդի ստեղծման հետ կապված խնդիր է առաջացել');
        }
      })
      .addCase(cancelUserThunk.fulfilled, (state: TInitialUserState): void => {
        state.cancelUser.isLoading = false;
      })
      .addCase(cancelUserThunk.pending, (state: TInitialUserState): void => {
        state.cancelUser.isLoading = true;
      })
      .addCase(cancelUserThunk.rejected, (state: TInitialUserState, action): void => {
        state.cancelUser.isLoading = false;
        if (action.payload === 'NetworkError') {
          SHOW_ERROR(NETWORK_ERROR_MESSAGE);
        } else {
          SHOW_ERROR('Բաժանորդի չեղարկման հետ կապված խնդիր է առաջացել');
        }
      })
      .addCase(toggleBanThunk.fulfilled, (state: TInitialUserState): void => {
        state.banUser.isLoading = false;
      })
      .addCase(toggleBanThunk.pending, (state: TInitialUserState): void => {
        state.banUser.isLoading = true;
      })
      .addCase(toggleBanThunk.rejected, (state: TInitialUserState, action): void => {
        state.banUser.isLoading = false;
        if (action.payload === 'NetworkError') {
          SHOW_ERROR(NETWORK_ERROR_MESSAGE);
        } else {
          SHOW_ERROR('Բաժանորդի ակտիվացման կամ ապաակտիվացման հետ կապված խնդիր է առաջացել');
        }
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
      }),
});
export const userReducer = userSlice.reducer;
export const { setAuthMode, setResetPasswordMode, clearResetPassword, logOut } = userSlice.actions;
