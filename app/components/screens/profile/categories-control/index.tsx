import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, RefreshControl, ScrollView, Text, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { fetchCategoriesThunk } from '../../../../redux/http/categoryThunk';
import { TCategory } from '../../../../redux/types';
import { API_URL, LIMIT_NUMBER } from '../../../../utils/constants';
import { CreateItemButton, CrudList, Main } from '../../../wrappers';

export const CategoriesControl = () => {
  const dispatch = useAppDispatch();
  const { create, update, delete: deleteCategory } = useAppSelector((state) => state.category);
  const [currentCategoryPage, setCategoryCurrentPage] = React.useState<number>(1);

  const isLoading = create.isLoading || update.isLoading || deleteCategory.isLoading;

  const fetchData = (): void => {
    dispatch(fetchCategoriesThunk({ page: currentCategoryPage, limit: LIMIT_NUMBER }));
  };

  React.useEffect((): void => {
    fetchData();
  }, [currentCategoryPage, isLoading]);

  const { categories } = useAppSelector((state) => state.category);
  const { navigate } = useNavigation<NavigationProp<ParamListBase>>();

  const handleClick = (): void => {
    navigate('categoryCreateEdit');
  };

  const handlePrevUserPage = (): void => {
    if (currentCategoryPage > 1) {
      setCategoryCurrentPage((prevPage: number) => prevPage - 1);
    }
  };

  const handleNextUserPage = (): void => {
    const totalUnconfirmedUsers: number = categories.total_items;
    if (currentCategoryPage * LIMIT_NUMBER < totalUnconfirmedUsers) {
      setCategoryCurrentPage((prevPage: number) => prevPage + 1);
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  return (
    <Main>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={categories.isLoading as boolean} onRefresh={handleRefresh} />
        }>
        <View className="m-4">
          {categories.total_items > 0 ? (
            <CrudList
              labelList="Կատեգորիաներ"
              data={categories.items}
              navigateTo="categoryCreateEdit"
              previousButtonDisable={currentCategoryPage <= 1}
              nextButtonDisable={currentCategoryPage * LIMIT_NUMBER >= categories.total_items}
              handlePreviousPage={handlePrevUserPage}
              handleNextPage={handleNextUserPage}
              totalItems={categories.total_items}
              renderItemComponent={(index: number, item: TCategory) => (
                <>
                  <View className="flex-row items-center gap-2">
                    <Text className="font-semibold">{index + 1}.</Text>
                    <Text className="min-w-[85px] w-36" numberOfLines={1} ellipsizeMode="tail">
                      {item.title}
                    </Text>
                  </View>
                  <Image
                    source={{ uri: `${API_URL + '/' + item.picture}` }}
                    alt={item.title}
                    className="w-10 h-10 rounded"
                  />
                </>
              )}
            />
          ) : null}
          <CreateItemButton handleClick={handleClick} createButtonLabel="Ստեղծել կատեգորիա" />
        </View>
      </ScrollView>
    </Main>
  );
};
