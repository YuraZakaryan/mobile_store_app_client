import React from 'react';
import { Text, View } from 'react-native';

import { TUser } from '../../../../../../redux/types';
import { CrudList } from '../../../../../wrappers';
import { IUserList } from '../../types';

export const UserList: React.FC<IUserList> = React.memo((props) => {
  const {
    users,
    label,
    handleNextPage,
    handlePreviousPage,
    previousButtonDisable,
    nextButtonDisable,
    totalItems,
    setSearchQuery,
    setHasSearched,
    searchQuery,
    hasSearched,
  } = props;

  return (
    <CrudList
      labelList={label}
      data={users}
      navigateTo="userCreateEdit"
      handleNextPage={handleNextPage}
      handlePreviousPage={handlePreviousPage}
      previousButtonDisable={previousButtonDisable}
      nextButtonDisable={nextButtonDisable}
      totalItems={totalItems}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      hasSearched={hasSearched}
      setHasSearched={setHasSearched}
      renderItemComponent={(index: number, item: TUser) => (
        <>
          <View className="flex-row items-center gap-2">
            <Text className="font-semibold">{index + 1}.</Text>
            <Text className="min-w-[85px]">{item.firstname}</Text>
          </View>
          <View>
            <Text className="text-gray-600">{item.username}</Text>
          </View>
        </>
      )}
    />
  );
});
UserList.displayName = 'UserList';
