import { FontAwesome } from '@expo/vector-icons';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../../../../hooks/redux';
import {
  setSyncProductsDialogStatus,
  setSyncProductsImageType,
} from '../../../../../../redux/reducers/product/productSlice';
import { EImageAdd } from '../../../../../../redux/types';
import { handleSync } from '../../../../../../utils';
import { ICON_MAIN_COLOR } from '../../../../../../utils/constants';

export const SyncProductsDialog = () => {
  const dispatch = useAppDispatch();
  const { syncProducts } = useAppSelector((state) => state.product);

  const imageSyncTypeTranslatorObj: Record<EImageAdd, string> = {
    [EImageAdd.WITH_IMAGE]: 'Բոլորը',
    [EImageAdd.WITHOUT_IMAGE]: 'Առանց նկար',
    [EImageAdd.WITH_IMAGE_FOR_EXIST]: 'Միայն թարմանցման ապրանքների համար',
    [EImageAdd.WITH_IMAGE_FOR_NEW]: 'Միայն նոր ապրանքների համար',
  };

  const syncTypeKeys = Object.keys(imageSyncTypeTranslatorObj) as EImageAdd[];
  const syncImageType: EImageAdd = syncProducts.imageSyncType;

  const renderItem = ({ item }: ListRenderItemInfo<EImageAdd>) => {
    const syncTypeLabel = imageSyncTypeTranslatorObj[item] || 'Unknown';
    const isSelected = item === syncImageType;

    return (
      <TouchableOpacity
        className={`flex-row p-5 my-1 w-full rounded bg-white ${isSelected ? 'border border-orange-400' : ''}`}
        onPress={() => dispatch(setSyncProductsImageType(item))}>
        <Text className="mx-2">{syncTypeLabel}</Text>
      </TouchableOpacity>
    );
  };

  const syncButton = () => {
    handleSync(syncImageType, dispatch);
  };

  const handleClose = (): void => {
    dispatch(setSyncProductsDialogStatus(false));
  };

  const isActive: boolean = syncProducts.dialogStatus || false;
  const isLoading: boolean = syncProducts.isLoading || false;

  return (
    <Modal animationType="fade" transparent visible={isActive}>
      <View
        className="items-center justify-center flex-1"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
        <View className="p-4 w-full max-h-[90%] max-w-[96%] bg-white/90 backdrop-blur-sm rounded-lg">
          <View className="flex-row justify-between w-full mb-2">
            <Text className="text-base font-semibold">Ապրանքների սիխրոնիզացոում</Text>
            <TouchableOpacity onPress={handleClose}>
              <FontAwesome name="window-close" size={25} color={ICON_MAIN_COLOR} />
            </TouchableOpacity>
          </View>
          <View className="flex-row gap-2 items-start mb-4">
            <Text className="text-red-500">*</Text>
            <Text>Ընտրեք նկարների սիխրոնիզացման տեսակը</Text>
          </View>

          <View className="flex-row gap-2 items-start mb-4">
            <Text className="text-red-500">*</Text>
            <Text>Հիշեցում ձեր ընտրությունը ազդում է սիխրոնիզացման ժամանակի վրա</Text>
          </View>

          <FlatList data={syncTypeKeys} renderItem={renderItem} keyExtractor={(item) => item} />

          <View className="mt-4">
            <TouchableOpacity
              className={`px-6 py-2 self-end rounded min-w-[150px] ${isLoading ? 'bg-slate-500' : 'bg-orange-400'}`}
              disabled={isLoading}
              onPress={syncButton}>
              {isLoading ? (
                <View style={{ height: 16 }}>
                  <ActivityIndicator
                    size="small"
                    color="white"
                    style={{ transform: [{ scale: 0.8 }] }}
                  />
                </View>
              ) : (
                <Text className="font-semibold text-white text-xs">Սիխրոնիզացնել</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
