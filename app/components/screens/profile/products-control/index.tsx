import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import React from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { useDebounce } from '../../../../hooks/useDebounce';
import { useIsTablet } from '../../../../hooks/useIsTablet';
import { fetchCategoriesThunk } from '../../../../redux/http/categoryThunk';
import {
  fetchControlNotActivatedProductsThunk,
  fetchControlProductsThunk,
} from '../../../../redux/http/productThunk';
import { setSyncProductsDialogStatus } from '../../../../redux/reducers/product/productSlice';
import { TProduct } from '../../../../redux/types';
import { SHOW_ERROR } from '../../../../toasts';
import { getLimitNumber } from '../../../../utils/constants';
import { Loading } from '../../../ui';
import { ButtonSyncProducts, CreateItemButton, CrudList, Main } from '../../../wrappers';
import { ProductRenderContent, SyncProductsDialog } from './ui';

export const ProductsControl = () => {
  const dispatch = useAppDispatch();
  const { isTablet, executeAfterDeviceCheck } = useIsTablet();
  const LIMIT_NUMBER = getLimitNumber(isTablet);

  const {
    productsControl: products,
    notActivatedProductsControl: notActivatedProducts,
    syncProducts,
    create,
    createByDocument,
    update,
    delete: deleteProduct,
  } = useAppSelector((state) => state.product);
  const { categories } = useAppSelector((state) => state.category);
  const { navigate } = useNavigation<NavigationProp<ParamListBase>>();
  const [hasSearched, setHasSearched] = React.useState<boolean>(false);
  const [hasSearchedNotActivated, setHasSearchedNotActivated] = React.useState<boolean>(false);
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [searchNotActivatedQuery, setSearchNotActivatedQuery] = React.useState<string>('');
  const [currentProductPage, setProductCurrentPage] = React.useState<number>(1);
  const [currentNotActivatedProductPage, setNotActivatedProductCurrentPage] =
    React.useState<number>(1);

  const isLoading =
    create.isLoading || createByDocument.isLoading || update.isLoading || deleteProduct.isLoading;
  const debouncedSearch: string = useDebounce(searchQuery, 500);
  const debouncedSearchNotActivated: string = useDebounce(searchNotActivatedQuery, 500);

  const fetchSearchData = (): void => {
    dispatch(
      fetchControlProductsThunk({
        page: 0,
        limit: LIMIT_NUMBER,
        query: debouncedSearch,
      })
    );
  };

  const fetchData = (): void => {
    dispatch(
      fetchControlProductsThunk({
        page: currentProductPage,
        limit: LIMIT_NUMBER,
        query: searchQuery,
      })
    );
    dispatch(fetchCategoriesThunk());
  };

  const fetchSearchNotActivated = (): void => {
    dispatch(
      fetchControlNotActivatedProductsThunk({
        page: 0,
        limit: LIMIT_NUMBER,
        query: debouncedSearchNotActivated,
      })
    );
  };

  const fetchNotActivatedData = (): void => {
    dispatch(
      fetchControlNotActivatedProductsThunk({
        page: currentNotActivatedProductPage,
        limit: LIMIT_NUMBER,
        query: searchNotActivatedQuery,
      })
    );
  };

  React.useEffect((): void => {
    executeAfterDeviceCheck(fetchData);
  }, [currentProductPage, isLoading, isTablet]);

  React.useEffect((): void => {
    executeAfterDeviceCheck(fetchSearchData);
  }, [debouncedSearch, isTablet]);

  React.useEffect((): void => {
    executeAfterDeviceCheck(fetchNotActivatedData);
  }, [currentNotActivatedProductPage, isLoading, isTablet]);

  React.useEffect((): void => {
    executeAfterDeviceCheck(fetchSearchNotActivated);
  }, [debouncedSearchNotActivated, isTablet]);

  const handlePrevProductPage = (): void => {
    if (currentProductPage > 1) {
      setProductCurrentPage((prevPage: number) => prevPage - 1);
    }
  };

  const handleNextProductPage = (): void => {
    const totalProducts: number = products.total_items;
    if (currentProductPage * LIMIT_NUMBER < totalProducts) {
      setProductCurrentPage((prevPage: number) => prevPage + 1);
    }
  };

  const handlePrevNotActivatedProductPage = (): void => {
    if (currentNotActivatedProductPage > 1) {
      setNotActivatedProductCurrentPage((prevPage: number) => prevPage - 1);
    }
  };

  const handleNextNotActivatedProductPage = (): void => {
    const totalProducts: number = notActivatedProducts.total_items;
    if (currentNotActivatedProductPage * LIMIT_NUMBER < totalProducts) {
      setNotActivatedProductCurrentPage((prevPage: number) => prevPage + 1);
    }
  };

  const handleClick = (): void => {
    if (categories.total_items === 0) {
      SHOW_ERROR('Առաջին հերթին ստեղծել կատեգորիա');
    } else {
      navigate('productCreateEdit');
    }
  };

  const handleRefresh = (): void => {
    fetchData();
    fetchNotActivatedData();
  };

  // const toggleDialog = (): void => {
  //   dispatch(toggleProductDocumentActive());
  // };

  const syncButton = () => dispatch(setSyncProductsDialogStatus(true));
  const syncLoading = syncProducts.isLoading ?? false;

  return (products.isLoading &&
    notActivatedProducts.isLoading &&
    (!hasSearched || !hasSearchedNotActivated)) ||
    isTablet === null ? (
    <Loading />
  ) : (
    <Main>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={products.isLoading as boolean} onRefresh={handleRefresh} />
        }
        keyboardShouldPersistTaps="handled">
        <View className="m-4">
          {products.total_items > 0 || hasSearched ? (
            <CrudList
              labelList="Ապրանքներ"
              data={products.items}
              navigateTo="productCreateEdit"
              previousButtonDisable={currentProductPage <= 1}
              nextButtonDisable={currentProductPage * LIMIT_NUMBER >= products.total_items}
              handlePreviousPage={handlePrevProductPage}
              handleNextPage={handleNextProductPage}
              totalItems={products.total_items}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              hasSearched={hasSearched}
              setHasSearched={setHasSearched}
              showDocumentDialogButton
              renderItemComponent={(index: number, item: TProduct) => (
                <ProductRenderContent index={index} title={item.title} picture={item.picture} />
              )}
              renderButton={() => <ButtonSyncProducts />}
            />
          ) : null}
          {notActivatedProducts.total_items > 0 || hasSearchedNotActivated ? (
            <CrudList
              labelList="Ոչ պատրաստի"
              data={notActivatedProducts.items}
              navigateTo="productCreateEdit"
              previousButtonDisable={currentNotActivatedProductPage <= 1}
              nextButtonDisable={
                currentNotActivatedProductPage * LIMIT_NUMBER >= notActivatedProducts.total_items
              }
              handlePreviousPage={handlePrevNotActivatedProductPage}
              handleNextPage={handleNextNotActivatedProductPage}
              totalItems={notActivatedProducts.total_items}
              searchQuery={searchNotActivatedQuery}
              setSearchQuery={setSearchNotActivatedQuery}
              hasSearched={hasSearchedNotActivated}
              setHasSearched={setHasSearchedNotActivated}
              showDocumentDialogButton={products.total_items === 0}
              renderItemComponent={(index: number, item: TProduct) => (
                <ProductRenderContent index={index} title={item.title} picture={item.picture} />
              )}
            />
          ) : null}
          {products.total_items === 0 && notActivatedProducts.total_items === 0 ? (
            <CreateItemButton
              handleClick={syncButton}
              createButtonLabel="Սիխրոնիզացնել"
              isLoading={syncLoading}
            />
          ) : null}
          <SyncProductsDialog />
          {/*<CreateItemButton handleClick={handleClick} createButtonLabel="Ստեղծել ապրանք" />*/}
        </View>
      </ScrollView>
    </Main>
  );
};
