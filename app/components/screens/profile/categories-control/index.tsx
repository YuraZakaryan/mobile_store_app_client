import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, RefreshControl, ScrollView, Text, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { useDebounce } from '../../../../hooks/useDebounce';
import { useIsTablet } from '../../../../hooks/useIsTablet';
import { fetchControlCategoriesThunk } from '../../../../redux/http/categoryThunk';
import { TCategory } from '../../../../redux/types';
import { API_URL, getLimitNumber } from '../../../../utils/constants';
import { Loading } from '../../../ui';
import { CreateItemButton, CrudList, Main } from '../../../wrappers';
import CategoriesDraggableDialog from '../categories-draggable';
import { ButtonSortCategories } from './ui';

export const CategoriesControl = () => {
  const dispatch = useAppDispatch();
  const { isTablet, executeAfterDeviceCheck } = useIsTablet();
  const LIMIT_NUMBER = getLimitNumber(isTablet);

  const {
    categoriesControl: categories,
    sortCategories,
    create,
    update,
    delete: deleteCategory,
  } = useAppSelector((state) => state.category);
  const { navigate } = useNavigation<NavigationProp<ParamListBase>>();
  const [currentCategoryPage, setCategoryCurrentPage] = React.useState<number>(1);
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [hasSearched, setHasSearched] = React.useState<boolean>(false);
  const isLoading =
    create.isLoading || update.isLoading || deleteCategory.isLoading || sortCategories.isLoading;
  const debouncedSearch: string = useDebounce(searchQuery, 500);

  const fetchSearchData = (): void => {
    dispatch(
      fetchControlCategoriesThunk({
        page: 0,
        limit: LIMIT_NUMBER,
        query: debouncedSearch,
      })
    );
  };

  const fetchData = (): void => {
    dispatch(
      fetchControlCategoriesThunk({
        page: currentCategoryPage,
        limit: LIMIT_NUMBER,
        query: searchQuery,
      })
    );
  };

  React.useEffect((): void => {
    executeAfterDeviceCheck(fetchSearchData);
  }, [debouncedSearch, isTablet]);

  React.useEffect((): void => {
    executeAfterDeviceCheck(fetchData);
  }, [currentCategoryPage, isLoading, isTablet]);

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

  return (categories.isLoading && !hasSearched) || isTablet === null ? (
    <Loading />
  ) : (
    <Main>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={categories.isLoading as boolean} onRefresh={handleRefresh} />
        }
        keyboardShouldPersistTaps="handled">
        <View className="m-4">
          {categories.total_items > 0 || hasSearched ? (
            <CrudList
              labelList="Կատեգորիաներ"
              data={categories.items}
              navigateTo="categoryCreateEdit"
              previousButtonDisable={currentCategoryPage <= 1}
              nextButtonDisable={currentCategoryPage * LIMIT_NUMBER >= categories.total_items}
              handlePreviousPage={handlePrevUserPage}
              handleNextPage={handleNextUserPage}
              totalItems={categories.total_items}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              hasSearched={hasSearched}
              setHasSearched={setHasSearched}
              showDocumentDialogButton
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
              renderButton={() => <ButtonSortCategories />}
            />
          ) : null}
          <CategoriesDraggableDialog />
          <CreateItemButton handleClick={handleClick} createButtonLabel="Ստեղծել կատեգորիա" />
        </View>
      </ScrollView>
    </Main>
  );
};
