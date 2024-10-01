import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { useIsTablet } from '../../../../hooks/useIsTablet';
import {
  confirmAdminOrderThunk,
  deleteAdminOrderItemThunk,
  getOneAdminOrderThunk,
  updateAdminOrderThunk,
} from '../../../../redux/http/orderThunk';
import {
  setAdminOrderNecessaryNotes,
  updateAdminItemCount,
} from '../../../../redux/reducers/order/orderSlice';
import { EOrderStatus, TOrderItem } from '../../../../redux/types/order';
import { SHOW_ERROR, SHOW_SUCCESS } from '../../../../toasts';
import { API_URL } from '../../../../utils/constants';
import { calculateDiscountedPrice, formattedPrice } from '../../../../utils/product';
import { Loading } from '../../../ui';
import { Main, NumericInputCustom } from '../../../wrappers';
import { CrudMainButton } from '../../../wrappers/crud-main-button';
import { SearchCounterparties } from './ui';

export const OrderAdminEdit = () => {
  const dispatch = useAppDispatch();
  const [editMode, setEditMode] = useState<boolean>(false);
  const hasScreenBeenRendered = useRef(false);

  const { navigate } = useNavigation<NavigationProp<Record<string, object | undefined>>>();

  const { isTablet, executeAfterDeviceCheck } = useIsTablet();

  const {
    adminOrder: order,
    addItemToAdminBasket,
    saveAdminOrder: save,
    confirmAdminOrder: confirm,
    create,
    deleteItem,
  } = useAppSelector((state) => state.order);

  const [itemLoadingStates, setItemLoadingStates] = useState<{ [itemId: string]: boolean }>({});

  // State to track if more data is being loaded
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const items = order.items;
  const totalCurrentPage: number = items.length;
  const isAnyItemCountZero = items.some((item) => item.itemCount === 0);

  const isSaveLoading = save.isLoading;
  const isConfirmLoading = confirm.isLoading;
  const isLoading =
    order.requestStatus.isLoading === null ||
    order.requestStatus.isLoading === true ||
    isTablet === null;

  const isConfirmed = order.status === EOrderStatus.CONFIRMED;
  const isEdited = isConfirmed && !editMode;

  const isConfirmDisable =
    isAnyItemCountZero || !order.counterpartyId || !!isConfirmLoading || order.items.length === 0;

  const setAllItemsCountToZero = () => {
    if (isConfirmed) {
      order.items.forEach((item) => {
        dispatch(updateAdminItemCount({ itemId: item._id, newValue: 0 }));
      });
    }
  };

  const fetchData = (): void => {
    if (order) {
      dispatch(getOneAdminOrderThunk(order._id as string));
    }
  };

  useEffect(() => {
    if (hasScreenBeenRendered.current) {
      executeAfterDeviceCheck(fetchData);
    } else {
      hasScreenBeenRendered.current = true;
    }
  }, [addItemToAdminBasket.isLoading, deleteItem.isLoading, create.isLoading, isTablet]);

  // Handle deletion of an order item
  const handleDelete = (_id: string): void => {
    setItemLoadingStates((prevLoadingStates) => ({
      ...prevLoadingStates,
      [_id]: true,
    }));

    dispatch(deleteAdminOrderItemThunk(_id))
      .then((): void => {
        setItemLoadingStates((prevLoadingStates) => ({
          ...prevLoadingStates,
          [_id]: false,
        }));
      })
      .catch((err): void => {
        err && SHOW_ERROR('Ապրանքի ջնջման հետ կապված խնդիր է առաջացել');
      });
  };

  const sumItemsPrice: number = items.reduce((acc: number, item: TOrderItem): number => {
    if (item.product && item.product.priceWholesale) {
      const itemPrice: number = item.product.discount
        ? calculateDiscountedPrice(item.product.priceWholesale, item.product.discount)
        : item.product.priceWholesale;
      return acc + itemPrice * item.itemCount;
    }
    return acc;
  }, 0);

  const handleChangeNotes = (text: string): void => {
    dispatch(setAdminOrderNecessaryNotes(text));
  };

  const handleNavigate = (): void => {
    navigate('search group', {});
  };

  const handleSave = () => {
    dispatch(updateAdminOrderThunk(isConfirmed ? { ...order, isEdited: true } : order))
      .then((res) => {
        if (res) {
          SHOW_SUCCESS('Փոփոխությունները պահպանվեցին');
        }
      })
      .catch((err) => {
        if (err) {
          switch (err) {
            case 502:
              SHOW_ERROR('Ապրանքներից մեկի քանակը ավելին է քան պահեստում');
              break;
            default:
              SHOW_ERROR('Փոփոխման հետ կապված խնդիր է առաջացել');
              break;
          }
        }
      });
  };

  const handleConfirm = () => {
    dispatch(confirmAdminOrderThunk(order))
      .unwrap()
      .then((res) => {
        if (res) {
          SHOW_SUCCESS('Պատվերը հաջողությամբ հաստատվեց');
        }
      })
      .catch((err) => {
        if (err) {
          switch (err) {
            case 'counterparty_not_found':
              SHOW_ERROR('Պատվիրատուն բացակայում է պահեստոում');
              break;
            case 'token_not_found':
              SHOW_ERROR('Թոքեն չի գտնվել');
              break;
            case 'items_array_is_empty':
              SHOW_ERROR('Ապրանքները բացակայում են');
              break;
            case 'one_of_the_values_does_not_match_the_request_body':
              SHOW_ERROR('Արժեքներից մեկը չի համապատասխանում հարցմանը');
              break;
            default:
              SHOW_ERROR('Հաստատման հետ կապված խնդիր է առաջացել');
              break;
          }
        }
      });
  };

  const handleEdit = () => {
    setAllItemsCountToZero();
    setEditMode(true);
  };

  const renderItem = ({ index, item }: { index: number; item: TOrderItem }) => {
    return (
      <>
        {item.product && (
          <View
            className={`flex-row flex-1 min-h-[150px] bg-white shadow relative ${
              totalCurrentPage % 2 === 1 && index === totalCurrentPage - 1
                ? 'rounded-t-lg'
                : 'rounded-lg'
            }`}>
            <TouchableOpacity
              className="absolute right-3 top-3"
              disabled={itemLoadingStates[item._id]}
              onPress={() => handleDelete(item._id)}>
              {itemLoadingStates[item._id] ? (
                <ActivityIndicator
                  style={{ transform: [{ scaleX: 0.6 }, { scaleY: 0.6 }] }}
                  size="large"
                  color="orange"
                />
              ) : !isEdited ? (
                <Image
                  source={require('../../../../assets/icons/delete-icon.png')}
                  className="w-5 h-5"
                  tintColor="orange"
                />
              ) : null}
            </TouchableOpacity>
            <View>
              {item.product && (
                <Image
                  source={
                    item.product.picture
                      ? {
                          uri:
                            (item.product.picture && `${API_URL}/${item.product.picture}`) ?? false,
                        }
                      : require('./../../../../assets/images/no_image.jpg')
                  }
                  className={`w-40 h-40 rounded-lg my-2 ${isTablet ? 'w-40 h-40' : 'w-24 h-24'}`}
                  alt={item.product.title}
                />
              )}
            </View>
            <View className="m-3 justify-between">
              <View className="max-w-[85%]">
                {item.product && <Text className="text-blue-600">{item.product.title}</Text>}
              </View>
              <View className="gap-1">
                {item.product && <Text className="text-gray-600">Կոդ։ {item.product.code}</Text>}
                {item.product && (
                  <Text className="text-gray-600 font-semibold">
                    Հասանելի քանակը։ {item.product.count}
                  </Text>
                )}
                <View className="flex-row items-center mt-2 ">
                  <Text className="text-orange-500 font-semibold ">Գին։</Text>
                  {item.product && (
                    <View className="ml-1 flex-row items-center">
                      <Text
                        className={`text-orange-500  ${
                          item.product.discount ? 'line-through text-gray-600' : ''
                        }`}>
                        {item.product.priceWholesale}
                        &nbsp;․դր
                      </Text>
                      {item.product.discount ? (
                        <Text className="text-sm text-orange-500 ml-1">
                          {formattedPrice(
                            calculateDiscountedPrice(
                              item.product.priceWholesale,
                              item.product.discount
                            )
                          )}
                          &nbsp;․դր
                        </Text>
                      ) : null}
                    </View>
                  )}
                </View>
                <View>
                  {item.product && (
                    <NumericInputCustom
                      value={item.itemCount}
                      minValue={0}
                      maxValue={item.product?.count || 0}
                      onChange={(newValue: number): void => {
                        if (!isEdited) {
                          dispatch(updateAdminItemCount({ itemId: item._id, newValue }));
                        }
                      }}
                      disabled={isEdited}
                    />
                  )}
                </View>
              </View>
            </View>
          </View>
        )}
      </>
    );
  };

  // Refresh data
  const handleRefresh = (): void => {
    fetchData();
    setEditMode(false);
  };

  useEffect(() => {
    if (!isLoading && isLoadingMore) {
      setIsLoadingMore(false);
    }
  }, [isLoading, isLoadingMore]);

  return isLoading ? (
    <Loading />
  ) : (
    <Main>
      <KeyboardAvoidingView behavior="padding" style={{ height: '100%' }}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={isLoading ?? false} onRefresh={handleRefresh} />
          }>
          <View className="w-full p-4 space-y-4">
            <View className="w-full">
              <FlatList
                data={items}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                horizontal={false}
                renderItem={renderItem}
              />
              {!isEdited ? (
                <View className="flex-row mt-2 flex-1 min-h-[40px] items-center px-4 bg-white border-gray-200 rounded-b-lg">
                  <TouchableOpacity onPress={handleNavigate}>
                    <Text className="text-orange-400 font-bold">+ Ավելացնել</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
            <View className="bg-white flex-row justify-between p-4 items-center w-full rounded-lg">
              <Text className="text-base text-gray-400">Ընդհանուր</Text>
              <Text className="font-semibold text-gray-600">
                {formattedPrice(sumItemsPrice)} ․դր
              </Text>
            </View>
            <View className="space-y-1">
              <Text className="text-gray-500">Ընտրել հաճախորդին</Text>
              <SearchCounterparties disabled={isEdited} />
            </View>
            <View className="flex-1 w-full space-y-1 mt-3">
              <Text className="text-gray-500">Անհրաժեշտ նշումներ</Text>
              <View className="w-full rounded-lg overflow-hidden mt-3">
                <TextInput
                  className="bg-white mx-auto px-2 py-3 text-base w-full"
                  value={order.necessaryNotes}
                  editable={!isEdited}
                  onChangeText={(text: string) => handleChangeNotes(text)}
                />
              </View>
            </View>
            <View className="w-full mt-6">
              {isEdited ? (
                <CrudMainButton
                  handleSubmit={handleEdit}
                  disabled={false}
                  isLoading={false}
                  className="py-4 bg-green-500">
                  Կրկնել պատվերը
                </CrudMainButton>
              ) : (
                <>
                  <CrudMainButton
                    handleSubmit={handleSave}
                    disabled={!!isSaveLoading}
                    isLoading={!!isSaveLoading}
                    className="py-4 bg-green-500">
                    Պահպանել
                  </CrudMainButton>
                  {!isConfirmed ? (
                    <CrudMainButton
                      handleSubmit={handleConfirm}
                      disabled={isConfirmDisable}
                      isLoading={!!isConfirmLoading}
                      className="py-4 mt-2">
                      Հաստատել Պատվերը
                    </CrudMainButton>
                  ) : null}
                </>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Main>
  );
};
