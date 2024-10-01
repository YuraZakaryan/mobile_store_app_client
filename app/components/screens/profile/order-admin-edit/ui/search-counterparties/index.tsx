import { AntDesign, Entypo, FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../../../../hooks/redux';
import { useDebounce } from '../../../../../../hooks/useDebounce';
import { fetchCounterPartiesThunk } from '../../../../../../redux/http/userThunk';
import { updateCounterPartyOfAdminOrder } from '../../../../../../redux/reducers/order/orderSlice';
import { setCounterpartiesSearchQuery } from '../../../../../../redux/reducers/user/userSlice';
import { TCounterParty } from '../../../../../../redux/types';
import { ICON_MAIN_COLOR } from '../../../../../../utils/constants';
import { ScrollLoader } from '../../../../../ui';

export interface ISearchCounterparties {
  disabled?: boolean;
}

export const SearchCounterparties: React.FC<ISearchCounterparties> = ({ disabled }) => {
  const dispatch = useAppDispatch();

  const { adminOrder: order } = useAppSelector((state) => state.order);

  const { counterParties, counterpartiesSearch } = useAppSelector((state) => state.user);

  const LIMIT_NUMBER = 10;

  // State to track if more data is being loaded
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [initialSearch, setInitialSearch] = React.useState<boolean>(false);

  // State to track the current page for fetching products
  const [currentCounterPartiesScreen, setCurrentCounterPartiesScreen] = useState<number>(1);

  const query = counterpartiesSearch.query;

  // Custom hook for debouncing the search query
  const debouncedSearch: string = useDebounce(query, 500);

  const fetchSearchCounterparties = (): void => {
    dispatch(
      fetchCounterPartiesThunk({
        query: debouncedSearch,
        limit: LIMIT_NUMBER,
        page: 0,
      })
    );
  };

  const fetchCounterParties = (isRefreshing: boolean = false): void => {
    if (isRefreshing) {
      setCurrentCounterPartiesScreen(1);
    }

    dispatch(
      fetchCounterPartiesThunk({
        query,
        limit: LIMIT_NUMBER,
        page: currentCounterPartiesScreen,
      })
    ).then(() => {
      setIsLoadingMore(false);
    });
  };

  useEffect((): void => {
    fetchSearchCounterparties();
  }, [debouncedSearch]);

  useEffect(() => {
    fetchCounterParties();
  }, [currentCounterPartiesScreen, initialSearch]);

  const toggleDialog = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSearchChange = (query: string): void => {
    if (!initialSearch) {
      setInitialSearch(true);
    }

    if (currentCounterPartiesScreen !== 1) {
      setCurrentCounterPartiesScreen(1);
    }

    dispatch(setCounterpartiesSearchQuery(query));
  };

  const handleClearSearch = (): void => {
    dispatch(setCounterpartiesSearchQuery(''));
  };

  const handleSelectChange = (id: string, name: string): void => {
    if (id && name) {
      dispatch(
        updateCounterPartyOfAdminOrder({
          id,
          name,
        })
      );
    }
    toggleDialog();
  };

  // Function to handle loading more products when reaching the end of the list
  const handleLoadMore = () => {
    if (currentCounterPartiesScreen * LIMIT_NUMBER < counterParties.total_items && !isLoadingMore) {
      setIsLoadingMore(true);
      setCurrentCounterPartiesScreen((prevPage: number) => prevPage + 1);
    }
  };

  // Function to handle manual data refresh
  const handleRefresh = () => {
    fetchCounterParties(true);
  };

  const items = counterParties.items;
  const isLoading = counterParties.isLoading;

  return (
    <View>
      <View className="bg-white mt-1 p-4 rounded-md">
        <TouchableOpacity
          onPress={toggleDialog}
          disabled={disabled}
          className="w-full flex-row justify-between">
          <Text>{order.counterpartyName || 'Ընտրել'}</Text>
          <Entypo name="chevron-small-down" size={24} color={ICON_MAIN_COLOR} />
        </TouchableOpacity>
      </View>
      <Modal animationType="fade" transparent visible={isOpen}>
        <View
          className="items-center justify-center flex-1"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <View className="p-4 space-y-5 w-full max-h-[90%] max-w-[96%] bg-white/90 backdrop-blur-sm rounded-lg">
            <View className="flex-row justify-between w-full mb-2">
              <Text className="font-semibold">Ընտրեք ապրանքի ավելացման վայրը</Text>
              <TouchableOpacity onPress={toggleDialog}>
                <FontAwesome name="window-close" size={24} color={ICON_MAIN_COLOR} />
              </TouchableOpacity>
            </View>

            <View className="space-y-12 py-4">
              <View className="relative flex-1 justify-center">
                <TextInput
                  className="p-3 h-12 pr-9 rounded-lg border border-gray-500"
                  placeholder="Փնտրել"
                  value={query}
                  onChangeText={handleSearchChange}
                />
                <View className="absolute right-3">
                  {query.length !== 0 ? (
                    <TouchableOpacity onPress={handleClearSearch}>
                      <AntDesign name="close" size={21} color="gray" />
                    </TouchableOpacity>
                  ) : (
                    <View>
                      <AntDesign name="search1" size={21} color="gray" />
                    </View>
                  )}
                </View>
              </View>

              <View className="mt-2">
                {!Array.isArray(items) || (isLoading !== null && items.length === 0) ? (
                  <View className="items-center">
                    <Image
                      source={require('./../../../../../../assets/images/products/sad-search.png')}
                      alt="counterparties are not found"
                      className="w-52 h-52"
                    />
                    <Text className="text-center text-xl text-orange-500 font-bold w-full">
                      Պատվիրատու չի գտնել
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    data={items}
                    ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                    renderItem={({ item }) => (
                      <View key={item.id} className="p-2 border border-gray-300 rounded-md">
                        <TouchableOpacity onPress={() => handleSelectChange(item.id, item.name)}>
                          <Text>{item.name}</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    keyExtractor={(item: TCounterParty) => item.id}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    refreshControl={
                      <RefreshControl refreshing={isLoading as boolean} onRefresh={handleRefresh} />
                    }
                    ListFooterComponent={isLoadingMore ? <ScrollLoader size={20} /> : null}
                  />
                )}
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
