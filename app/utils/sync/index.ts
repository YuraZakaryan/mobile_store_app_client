import { syncProductsByStockThunk } from '../../redux/http/productThunk';
import { AppDispatch } from '../../redux/store';
import { SHOW_ERROR, SHOW_SUCCESS } from '../../toasts';
import { NETWORK_ERROR_MESSAGE } from '../constants';

export const handleSync = (dispatch: AppDispatch): void => {
  dispatch(syncProductsByStockThunk())
    .unwrap()
    .then((res): void => {
      if (res) {
        const numbers = res.message.match(/\d+/g);
        if (numbers) {
          SHOW_SUCCESS(`Ստեղծվեց ${numbers[0]} և թարմացվեց ${numbers[1]} ապրանք`);
        }
      }
    })
    .catch((err): void => {
      switch (err) {
        case 'token_not_found':
          SHOW_ERROR('Թոքեն չի գտնվել');
          break;
        case 'invalid_token':
          SHOW_ERROR('Սխալ Թոքենի ձևաչափ');
          break;
        case 'there_are_not_products_for_sync':
          SHOW_ERROR('Չեն գտնվել ապրանքներ պահոցում');
          break;
        default:
          SHOW_ERROR(NETWORK_ERROR_MESSAGE);
          break;
      }
    });
};
