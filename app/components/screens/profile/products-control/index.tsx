import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, RefreshControl, ScrollView, Text, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { fetchProductsThunk } from '../../../../redux/http/productThunk';
import { TProduct } from '../../../../redux/types';
import { API_URL, LIMIT_NUMBER } from '../../../../utils/constants';
import { CreateItemButton, CrudList, Main } from '../../../wrappers';

export const ProductsControl = () => {
  const dispatch = useAppDispatch();
  const [currentProductPage, setProductCurrentPage] = React.useState<number>(1);

  const fetchData = (): void => {
    dispatch(fetchProductsThunk({ page: currentProductPage, limit: LIMIT_NUMBER }));
  };

  React.useEffect((): void => {
    fetchData();
  }, [currentProductPage]);

  const { products } = useAppSelector((state) => state.product);
  const { navigate } = useNavigation<NavigationProp<ParamListBase>>();

  const handlePrevUserPage = (): void => {
    if (currentProductPage > 1) {
      setProductCurrentPage((prevPage: number) => prevPage - 1);
    }
  };

  const handleNextUserPage = (): void => {
    const totalUnconfirmedUsers: number = products.total_items;
    if (currentProductPage * LIMIT_NUMBER < totalUnconfirmedUsers) {
      setProductCurrentPage((prevPage: number) => prevPage + 1);
    }
  };

  const handleClick = (): void => {
    navigate('productCreateEdit');
  };

  const handleRefresh = (): void => {
    fetchData();
  };

  return (
    <Main>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={products.isLoading} onRefresh={handleRefresh} />
        }>
        <View className="m-4">
          {products.total_items > 0 ? (
            <CrudList
              labelList="Ապրանքներ"
              data={products.items}
              navigateTo="productCreateEdit"
              previousButtonDisable={currentProductPage <= 1}
              nextButtonDisable={currentProductPage * LIMIT_NUMBER >= products.total_items}
              handlePreviousPage={handlePrevUserPage}
              handleNextPage={handleNextUserPage}
              totalItems={products.total_items}
              renderItemComponent={(index: number, item: TProduct) => (
                <>
                  <View className="flex-row items-center gap-2">
                    <Text className="font-semibold">{index + 1}.</Text>
                    <Text className="min-w-[85px] w-36" numberOfLines={1} ellipsizeMode="tail">
                      {item.title}
                    </Text>
                  </View>
                  {item.picture && (
                    <Image
                      source={{ uri: `${API_URL + '/' + item.picture}` }}
                      alt={item.title}
                      className="w-10 h-10 rounded"
                    />
                  )}
                </>
              )}
            />
          ) : null}

          <CreateItemButton handleClick={handleClick} createButtonLabel="Ստեղծել ապրանք" />
        </View>
      </ScrollView>
    </Main>
  );
};
