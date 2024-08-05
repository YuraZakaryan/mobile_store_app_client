import { syncProductsByStockThunk } from '../../redux/http/productThunk';
import { syncProductIsLoading } from '../../redux/reducers/product/productSlice';
import { AppDispatch } from '../../redux/store';
import { SHOW_ERROR, SHOW_SUCCESS } from '../../toasts';

export const handleSync = (dispatch: AppDispatch): void => {
  dispatch(syncProductIsLoading(true));

  const timeoutId = setTimeout(() => {
    SHOW_SUCCESS('Սիխրոնիզացման ավարտից հետո ձեր Էլ. փոստին, հաստատման նամակ կուղարկվի');
    dispatch(syncProductIsLoading(false));
  }, 1800);

  dispatch(syncProductsByStockThunk())
    .unwrap()
    .then(() => {
      clearTimeout(timeoutId);
    })
    .catch((err): void => {
      clearTimeout(timeoutId);
      dispatch(syncProductIsLoading(false));
      switch (err) {
        case 'token_not_found':
          SHOW_ERROR('Թոքեն չի գտնվել');
          break;
        case 'there_are_not_products_for_sync':
          SHOW_ERROR('Չեն գտնվել ապրանքներ պահոցում');
          break;
        default:
          SHOW_ERROR('Սխալ Թոքենի ձևաչափ');
          break;
      }
    });
};
