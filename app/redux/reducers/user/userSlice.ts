import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SecureStoreService } from '../../../services';
import { SHOW_ERROR, SHOW_SUCCESS } from '../../../toasts';
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
  resetPassword: {
    mode: EResetPasswordMode.MAIL_SECTION,
    mail: '',
    otp: '',
    isLoading: false,
    isError: false,
  },
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
        state.login.isError = false;
      })
      .addCase(loginThunk.rejected, (state: TInitialUserState): void => {
        state.login.isLoading = false;
        state.login.isError = true;
        SHOW_ERROR('Մուտքանունը կամ գաղտնաբառը սխալ է');
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
        state.users = {
          total_items: 0,
          items: [],
          isError: true,
          isLoading: false,
        };
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
        state.unconfirmedUsers = {
          total_items: 0,
          items: [],
          isError: true,
          isLoading: false,
        };
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
        state.bannedUsers = {
          total_items: 0,
          items: [],
          isError: true,
          isLoading: false,
        };
      })
      .addCase(
        updateUserThunk.fulfilled,
        (state: TInitialUserState, action: PayloadAction<TUser>): void => {
          if (action.payload) {
            const { _id } = action.payload;
            state.updateUser.isError = false;
            state.updateUser.isLoading = false;
            if (state.user?._id === _id) {
              SHOW_SUCCESS('Փոփոխությունները տեսնելու համար նորից մուտք գործեք ծրագիր');
            } else {
              SHOW_SUCCESS('Բաժանորդի տվյալները հաջողությամբ փոխվեցին');
            }
          }
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
        state.resetPassword.isError = false;
        state.resetPassword.isLoading = true;
      })
      .addCase(sendOtpToMailThunk.rejected, (state: TInitialUserState): void => {
        state.resetPassword.isError = true;
        state.resetPassword.isLoading = false;
        SHOW_ERROR('Նշված էլեկտրոնային փոստով բաժանորդ չի գտնվել');
      })
      .addCase(confirmOtpThunk.fulfilled, (state: TInitialUserState, action): void => {
        if (action.payload) {
          state.resetPassword = {
            isLoading: false,
            isError: false,
            otp: action.payload.otp,
            mail: action.payload.mail,
            mode: EResetPasswordMode.NEW_PASS_SECTION,
          };
        }
      })
      .addCase(confirmOtpThunk.pending, (state: TInitialUserState): void => {
        state.resetPassword.isError = false;
        state.resetPassword.isLoading = true;
      })
      .addCase(confirmOtpThunk.rejected, (state: TInitialUserState, action): void => {
        state.resetPassword.isError = true;
        state.resetPassword.isLoading = false;
        if (action.payload) {
          if (action.payload === 410) {
            SHOW_ERROR('Նշված մեկ անգամյա գաղտմաբառը այլևս վավեր չէ, խնդրում ենք պահանջել նորը');
          } else if (action.payload === 403) {
            SHOW_ERROR('Սխալ մեկ անգամյա գաղտնաբառ');
          }
        }
      })
      .addCase(resetPasswordThunk.fulfilled, (state: TInitialUserState, action): void => {
        if (action.payload) {
          state.resetPassword = initialState.resetPassword;
          SHOW_SUCCESS('Գաղտնաբառը հաջողությամբ փոխվեց');
        }
      })
      .addCase(resetPasswordThunk.pending, (state: TInitialUserState): void => {
        state.resetPassword.isError = false;
        state.resetPassword.isLoading = true;
      })
      .addCase(resetPasswordThunk.rejected, (state: TInitialUserState, action): void => {
        state.resetPassword.isError = true;
        state.resetPassword.isLoading = false;
        if (action.payload) {
          if (action.payload === 404) {
            SHOW_ERROR('Այս էլ․ փոստով բաժանորդ չի գտնվել');
          } else if (action.payload === 403) {
            SHOW_ERROR('Սխալ մեկ անգամյա գաղտնաբառ');
          }
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
          if (action.payload) {
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
        state.user = null;
        state.fetchMe.isError = true;
        state.fetchMe.isLoading = false;
      }),
});
export const userReducer = userSlice.reducer;
export const { setAuthMode, setResetPasswordMode, clearResetPassword, logOut } = userSlice.actions;
