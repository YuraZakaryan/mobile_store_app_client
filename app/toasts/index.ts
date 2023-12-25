import Toast from 'react-native-toast-message';

export const SHOW_ERROR = (text: string): void => {
  Toast.show({
    type: 'error',
    text1: 'Խնդիր',
    text2: text,
  });
};
export const SHOW_SUCCESS = (text: string): void => {
  Toast.show({
    type: 'success',
    text1: 'Հաջողությամբ',
    text2: text,
  });
};
