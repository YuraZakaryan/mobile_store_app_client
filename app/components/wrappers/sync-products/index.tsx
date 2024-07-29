import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { ISyncProducts } from '../../../types';
import { handleSync } from '../../../utils';

export const SyncProducts: React.FC<ISyncProducts> = ({ showDocumentDialogButton, className }) => {
  const dispatch = useAppDispatch();
  const { syncProducts } = useAppSelector((state) => state.product);

  // const handleSync = (): void => {
  //   dispatch(syncProductsByStockThunk())
  //     .unwrap()
  //     .then((res): void => {
  //       if (res) {
  //         const numbers = res.message.match(/\d+/g);
  //         if (numbers) {
  //           SHOW_SUCCESS(`Ստեղծվեց ${numbers[0]} և թարմացվեց ${numbers[1]} ապրանք`);
  //         }
  //       }
  //     })
  //     .catch((err): void => {
  //       switch (err) {
  //         case 'token_not_found':
  //           SHOW_ERROR('Թոքեն չի գտնվել');
  //           break;
  //         case 'invalid_token':
  //           SHOW_ERROR('Սխալ Թոքենի ձևաչափ');
  //           break;
  //         case 'there_are_not_products_for_sync':
  //           SHOW_ERROR('Չեն գտնվել ապրանքներ պահոցում');
  //           break;
  //         default:
  //           SHOW_ERROR(NETWORK_ERROR_MESSAGE);
  //           break;
  //       }
  //     });
  // };

  const syncButton = () => handleSync(dispatch);
  const isLoading: boolean = syncProducts.isLoading ?? false;

  return showDocumentDialogButton ? (
    <TouchableOpacity
      className={`px-6 py-2 bg-orange-400 min-w-[170px] rounded ${className}`}
      onPress={syncButton}>
      {isLoading ? (
        <View style={{ height: 17 }}>
          <ActivityIndicator size="small" color="white" style={{ transform: [{ scale: 0.8 }] }} />
        </View>
      ) : (
        <Text className="font-semibold text-white">Սիխրոնիզացնել</Text>
      )}
    </TouchableOpacity>
  ) : null;
};
