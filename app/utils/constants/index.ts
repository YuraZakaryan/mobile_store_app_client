import { EXPO_PUBLIC_API_URL, EXPO_PUBLIC_LOCAL_URL } from '@env';

const API_URL = EXPO_PUBLIC_LOCAL_URL || '';
const ICON_MAIN_COLOR: string = '#e78828';
const LIMIT_NUMBER: number = 6;
const NETWORK_ERROR_MESSAGE: string = 'Առկա է կապի հետ կապված խնդիր';

export { ICON_MAIN_COLOR, API_URL, LIMIT_NUMBER, NETWORK_ERROR_MESSAGE };
