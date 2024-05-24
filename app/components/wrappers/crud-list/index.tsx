import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { useAppDispatch } from '../../../hooks/redux';
import { toggleProductDocumentActive } from '../../../redux/reducers/product/productSlice';
import { ICrudListProps } from '../../../types';
import { TUserListNavigationProps } from '../../screens/profile/users-control/types';
import { DialogImportDocument } from '../dialog-import-document';
import { PaginationButtons } from '../pagination-buttons';
import { SyncProducts } from '../sync-products';

export const CrudList = <T,>(props: ICrudListProps<T>): React.ReactElement => {
  const {
    labelList,
    data,
    navigateTo,
    renderItemComponent,
    fieldButtonType = 'edit',
    handlePreviousPage,
    handleNextPage,
    previousButtonDisable,
    nextButtonDisable,
    totalItems,
    setSearchQuery,
    setHasSearched,
    searchQuery,
    hasSearched,
    searchFieldPlaceholder,
    showDocumentDialogButton,
  } = props;

  const dispatch = useAppDispatch();
  const { navigate } = useNavigation<NavigationProp<TUserListNavigationProps>>();
  const handleClick = (item: T): void => {
    navigate(navigateTo, { item });
  };

  const handleClearQuery = (): void => {
    if (setSearchQuery) {
      setSearchQuery('');
    }
  };

  const handleChangeQuery = (text: string): void => {
    if (setHasSearched && !hasSearched) {
      setHasSearched(true);
    }
    if (setSearchQuery) {
      setSearchQuery(text);
    }
  };
  const toggleDialog = (): void => {
    dispatch(toggleProductDocumentActive());
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="mb-4">
        {/*<DialogImportDocument />*/}
        {/*<View className="flex-row items-center justify-between mb-2">*/}
        {/*  {labelList && <Text className="text-lg font-semibold">{labelList}</Text>}*/}
        {/*  {showDocumentDialogButton ? (*/}
        {/*    <TouchableOpacity className="px-6 py-2 bg-orange-400 rounded" onPress={toggleDialog}>*/}
        {/*      <Text className="font-semibold text-white">Ներբեռնել XLSX</Text>*/}
        {/*    </TouchableOpacity>*/}
        {/*  ) : null}*/}
        {/*</View>*/}
        <View className="flex-row items-center justify-between mb-2">
          {labelList && <Text className="text-lg font-semibold">{labelList}</Text>}
          <SyncProducts showDocumentDialogButton={showDocumentDialogButton as boolean} />
        </View>
        <View className="bg-white rounded-lg shadow">
          <View className="flex-1 justify-center bg-transparent border-b border-gray-200 w-full rounded-t-lg py-3 relative">
            <TextInput
              className="w-full px-4"
              onChangeText={handleChangeQuery}
              value={searchQuery && searchQuery}
              placeholder={searchFieldPlaceholder ? searchFieldPlaceholder : `Փնտրել`}
            />
            <View className="absolute right-5">
              {searchQuery && searchQuery.length !== 0 ? (
                <TouchableOpacity onPress={handleClearQuery}>
                  <AntDesign name="close" size={18} color="gray" />
                </TouchableOpacity>
              ) : (
                <View>
                  <AntDesign name="search1" size={18} color="gray" />
                </View>
              )}
            </View>
          </View>
          {data && data.length === 0 ? (
            <View className="flex-1 justify-center items-center mx-4 my-5">
              <Image
                source={require('./../../../assets/images/missing_items.png')}
                alt="missing_items"
                className="w-20 h-20 scale-[2]"
              />
              <Text className="text-base font-bold mt-2 italic text-gray-600">Չի գտնվել</Text>
            </View>
          ) : (
            <FlatList
              scrollEnabled={false}
              data={data}
              renderItem={({ index, item }) => (
                <View className="p-4 border-b border-gray-300 justify-between items-center flex-row">
                  {renderItemComponent(index, item)}
                  <View>
                    <TouchableOpacity onPress={() => handleClick(item)}>
                      <MaterialCommunityIcons
                        name={fieldButtonType === 'edit' ? 'account-edit' : 'file-search-outline'}
                        size={24}
                        color="orange"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              horizontal={false}
              keyExtractor={(item: T, index: number) => `${index}`}
            />
          )}
        </View>
        <PaginationButtons
          total_items={totalItems}
          previousButtonDisable={previousButtonDisable}
          nextButtonDisable={nextButtonDisable}
          handlePrevPage={handlePreviousPage}
          handleNextPage={handleNextPage}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

CrudList.displayName = 'CrudList';
