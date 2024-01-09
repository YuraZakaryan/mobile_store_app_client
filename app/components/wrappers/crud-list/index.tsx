import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

import { ICrudListProps } from '../../../types';
import { TUserListNavigationProps } from '../../screens/profile/users-control/types';
import { PaginationButtons } from '../pagination-buttons';

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
  } = props;

  const { navigate } = useNavigation<NavigationProp<TUserListNavigationProps>>();

  const handleClick = (item: T): void => {
    navigate(navigateTo, { item });
  };

  return (
    <View className="mb-4">
      {labelList && <Text className="text-lg font-semibold mb-2">{labelList}</Text>}
      <View className="bg-white rounded-lg shadow">
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
      </View>
      <PaginationButtons
        total_items={totalItems}
        previousButtonDisable={previousButtonDisable}
        nextButtonDisable={nextButtonDisable}
        handlePrevPage={handlePreviousPage}
        handleNextPage={handleNextPage}
      />
    </View>
  );
};

CrudList.displayName = 'CrudList';
