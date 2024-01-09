import { TRole } from '../../redux/types';
import { TRoleSelect } from '../../types';

const isAdmin = (role: TRole): boolean => {
  return role === 'ADMIN' || role === 'MODERATOR';
};
export { isAdmin };

export const selectRoles: TRoleSelect[] = [
  { label: 'Հաճախորդ', value: 'USER' },
  { label: 'Մոդերատոր', value: 'MODERATOR' },
  { label: 'Ադմինիստրատոր', value: 'ADMIN' },
];
export const accountEditLabels = {
  editAccount: 'Փոփոխել տվյալները',
  editPassword: 'Փոփոխել գաղտնաբառը',
};
