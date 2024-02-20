import { FontAwesome, Entypo } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Modal, Text, TouchableOpacity, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { createProductByDocumentThunk } from '../../../redux/http/productThunk';
import {
  setProductDocument,
  toggleProductDocumentActive,
} from '../../../redux/reducers/product/productSlice';
import { SHOW_ERROR, SHOW_SUCCESS } from '../../../toasts';
import { TCustomFileType } from '../../../types';
import { ICON_MAIN_COLOR, NETWORK_ERROR_MESSAGE } from '../../../utils/constants';
import { pickDocument } from '../../../utils/image';

export const DialogImportDocument = () => {
  const dispatch = useAppDispatch();
  const { productDocument, createByDocument } = useAppSelector((state) => state.product);
  const toggleDialog = (): void => {
    dispatch(toggleProductDocumentActive());
  };

  const isFileExist: File | null = productDocument.file;
  const handlePick = (file: TCustomFileType): void => {
    dispatch(setProductDocument(file));
  };

  const handleClose = (): void => {
    dispatch(toggleDialog);
    dispatch(setProductDocument(null));
  };

  const handleUpload = (): void => {
    const formData: FormData = new FormData();
    formData.append('document', productDocument.file as File);

    dispatch(createProductByDocumentThunk(formData))
      .unwrap()
      .then((res) => res && SHOW_SUCCESS(`Ներբեռնվեց ${res.totalItems} ապրանք`))
      .catch((err): void => {
        switch (err) {
          case 'there_are_no_product_for_import':
            SHOW_ERROR('Չեն գտնվել նոր ապրանքներ');
            break;
          case 'workbook_does_not_contain_any_sheets':
            SHOW_ERROR('Չի գտնվել բովանդակություն հետևյալ փաստաթղթում');
            break;
          case 'invalid_product_data':
            SHOW_ERROR('Սխալ փաստաթղթի բովանդակություն');
            break;
          case 'invalid_document_format':
            SHOW_ERROR('Սխալ փաստաթղթի տեսակ');
            break;
          default:
            SHOW_ERROR(NETWORK_ERROR_MESSAGE);
            break;
        }
      });
  };

  const isLoading: boolean = createByDocument.isLoading ?? false;

  return (
    <Modal animationType="fade" transparent visible={productDocument.dialogActive}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
        <View className="flex-1 justify-center items-center p-4">
          <View className="flex items-center p-4 w-full bg-white/60 backdrop-blur-sm rounded-lg">
            <View className="flex-row justify-between w-full">
              <Text className="text-base font-semibold">Ավելացնել նոր ապրանքներ</Text>
              {!isLoading ? (
                <TouchableOpacity onPress={handleClose}>
                  <FontAwesome name="window-close" size={25} color={ICON_MAIN_COLOR} />
                </TouchableOpacity>
              ) : null}
            </View>
            <View className="justify-center items-center gap-2 min-h-[165px] w-full my-6 p-10 border-2 rounded-lg border-orange-400">
              <Entypo name="upload" size={20} color="gray" />
              <TouchableOpacity
                className="flex-row relative"
                onPress={() => pickDocument(handlePick)}>
                <Text className="text-orange-400 text-base font-semibold underline">
                  {isFileExist ? 'Վերընտրել' : 'Ընտրել'} փաստաթութը
                </Text>
                <Text className="text-[10px] text-red-600 font-bold absolute -right-6 -top-2">
                  *XLSX
                </Text>
              </TouchableOpacity>
              {isFileExist ? (
                <View className="flex-row justify-center gap-1">
                  <Text className="text-gray-600">Ընտրվել է</Text>
                  <Text className="text-gray-600 underline italic">
                    {productDocument.file?.name}
                  </Text>
                </View>
              ) : null}
            </View>

            <View className="flex-row w-full justify-end gap-2">
              {isFileExist && !isLoading ? (
                <TouchableOpacity className="py-2 px-4 rounded bg-gray-500" onPress={handleClose}>
                  <Text className="text-white font-semibold">Չեղարկել</Text>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                className="py-2 px-4 min-w-[115px] rounded bg-orange-400"
                onPress={handleUpload}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white font-semibold">Հաստատել</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
