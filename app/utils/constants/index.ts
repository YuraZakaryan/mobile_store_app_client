import { EXPO_PUBLIC_SERVER_API_URL } from '@env';

const API_URL = EXPO_PUBLIC_SERVER_API_URL || 'http://192.168.10.59:5000';
const ICON_MAIN_COLOR: string = '#e78828';
const LIMIT_NUMBER: number = 6;
const NETWORK_ERROR_MESSAGE: string = 'Առկա է կապի հետ կապված խնդիր';

export { API_URL, ICON_MAIN_COLOR, LIMIT_NUMBER, NETWORK_ERROR_MESSAGE };
