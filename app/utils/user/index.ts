import { EPriceType, TRole } from '../../redux/types';
import { TSelect } from '../../types';

const isAdmin = (role: TRole): boolean => {
  return role === 'ADMIN' || role === 'MODERATOR';
};
export { isAdmin };

export const selectRoles: TSelect[] = [
  { label: 'Հաճախորդ', value: 'USER' },
  { label: 'Հաճախորդ (արտոնություններով)', value: 'SUPERUSER' },
  { label: 'Մոդերատոր', value: 'MODERATOR' },
  { label: 'Ադմինիստրատոր', value: 'ADMIN' },
];

export const selectPriceType: TSelect[] = [
  { label: 'Մանրածախ', value: EPriceType.RETAIL },
  { label: 'Մեծածախ', value: EPriceType.WHOLESALE },
];

export const accountEditLabels = {
  editAccount: 'Փոփոխել տվյալները',
  editPassword: 'Փոփոխել գաղտնաբառը',
};
