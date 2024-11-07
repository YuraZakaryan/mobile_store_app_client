import { Feather, FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAppDispatch, useAppSelector } from '../../../../../hooks/redux';
import {
  addItemToAdminBasketThunk,
  createOrAddOrderThunk,
  fetchAdminActiveOrdersThunk,
} from '../../../../../redux/http/orderThunk';
import { setAddToCardDialogStatus } from '../../../../../redux/reducers/product/productSlice';
import { TProduct } from '../../../../../redux/types';
import { TAdminOrder, TOrderItem } from '../../../../../redux/types/order';
import { SHOW_ERROR } from '../../../../../toasts';
import { ICON_MAIN_COLOR } from '../../../../../utils/constants';
import { IAddToCart } from '../../types';

export const AddToCart: React.FC<IAddToCart> = ({ productId }) => {
  const dispatch = useAppDispatch();

  const [orderExistsAfterClick, setOrderExistsAfterClick] = useState<boolean>(false);
  const [isSelected, setIsSelected] = useState<'personal-cart' | 'administration-cart' | null>(
    null
  );
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const { currentProduct } = useAppSelector((state) => state.product);
  const { user } = useAppSelector((state) => state.user);
  const {
    basket,
    create,
    deleteItem,
    newItemForm,
    adminActiveOrders: orders,
  } = useAppSelector((state) => state.order);

  const fetchOrders = (): void => {
    dispatch(fetchAdminActiveOrdersThunk({}));
  };

  useEffect(() => {
    if (isSelected === 'administration-cart') {
      fetchOrders();
    }
  }, [isSelected]);

  // Reset orderExistsAfterClick on deleteItem.isLoading change
  useEffect(() => {
    if (orderExistsAfterClick) {
      setOrderExistsAfterClick(false);
    }
  }, [deleteItem.isLoading]);

  // Check if the order exists in the basket
  const orderExists: boolean = basket.items.some(
    (order: TOrderItem): boolean => order.product._id === productId
  );

  const renderItem = ({ item }: ListRenderItemInfo<TAdminOrder>) => {
    const isSelectedOrder = selectedOrderId === item._id;
    return (
      <TouchableOpacity
        onPress={() => setSelectedOrderId(item._id as string)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 10,
          backgroundColor: isSelectedOrder ? 'rgba(255, 165, 0, 0.2)' : 'white',
          borderColor: isSelectedOrder ? 'orange' : 'lightgray',
          borderWidth: 1,
          borderRadius: 5,
          marginVertical: 5,
        }}>
        <View
          style={{
            height: 20,
            width: 20,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: isSelectedOrder ? 'orange' : 'lightgray',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 10,
          }}>
          {isSelectedOrder && (
            <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: 'orange' }} />
          )}
        </View>
        <Text>{item.counterpartyName || 'Անանուն պատվեր'}</Text>
      </TouchableOpacity>
    );
  };

  const handleToPersonalCart = (): void => {
    dispatch(createOrAddOrderThunk(newItemForm))
      .unwrap()
      .then((res: TProduct) => res && setOrderExistsAfterClick(true))
      .catch((err): void => {
        if (err === 409) {
          SHOW_ERROR('Ձեր էջը հաստատված չէ, փորձել մի փոքր ուշ');
        } else if (err === 410) {
          SHOW_ERROR('Ձեր հաշիվը արգելափակված է');
        } else if (err === 502) {
          SHOW_ERROR('ՈՉ ԲԱՎԱՐԱՐ ԱՊՐԱՆՔԻ ՔԱՆԱԿ, ԹԱՐՄԱՑՐԵՔ ԷՋԸ');
        } else if (err === 401) {
          SHOW_ERROR('Կխնդրեինք առաջին հերթին մուտք գործել');
        } else {
          SHOW_ERROR('Ապրանքի զամբյուղում ավելացնելու հետ կապված խնդրի է առաջացել');
        }
      });
  };

  const toggleDialog = () => {
    dispatch(setAddToCardDialogStatus(!currentProduct.addToCardDialogStatus));
  };

  const handleCartSelection = (cartType: 'personal-cart' | 'administration-cart') => {
    setIsSelected(cartType);
  };

  const handleClick = () => {
    if (isSelected === 'personal-cart') {
      handleToPersonalCart();
    } else if (isSelected === 'administration-cart') {
      if (selectedOrderId) {
        dispatch(
          addItemToAdminBasketThunk({
            ...newItemForm,
            order: selectedOrderId,
            forStock: true,
          })
        )
          .unwrap()
          .then((res) => {
            if (res) {
              toggleDialog();
            }
          })
          .catch((err): void => {
            if (err === 409) {
              SHOW_ERROR('Ապրանքը արդեն կա այս պատվերում');
            } else if (err === 502) {
              SHOW_ERROR('ՈՉ ԲԱՎԱՐԱՐ ԱՊՐԱՆՔԻ ՔԱՆԱԿ, ԹԱՐՄԱՑՐԵՔ ԷՋԸ');
            } else if (err === 401) {
              SHOW_ERROR('Կխնդրեինք առաջին հերթին մուտք գործել');
            } else {
              SHOW_ERROR('Ապրանքի զամբյուղում ավելացնելու հետ կապված խնդրի է առաջացել');
            }
          });
      } else {
        SHOW_ERROR('Ընտրեք ադմինիստրացիոն զամբյուղի պատվերը');
      }
    } else {
      SHOW_ERROR('Ընրտեք վայրը, մինչ շարունակելը');
    }
  };

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'MODERATOR';
  const isDialogOpen = currentProduct.addToCardDialogStatus && isAdmin;
  const isLoading = create.isLoading;

  const isOrderExist = (orderExists || orderExistsAfterClick) && !isAdmin;
  const isAdminOrderExist = (orderExists || orderExistsAfterClick) && isAdmin;

  // Check if the button should be disabled
  const isButtonDisable: boolean = newItemForm.itemCount === 0 || create.isLoading || isOrderExist;

  return (
    <>
      <View className="min-h-[40px] w-full flex-1 justify-center mt-5 items-center">
        <TouchableOpacity
          className={`bg-orange-600 p-4 w-5/6 rounded-lg${isButtonDisable ? ' bg-gray-400' : ''}`}
          onPress={isAdmin ? toggleDialog : handleToPersonalCart}
          disabled={isButtonDisable}>
          {isLoading && !isAdmin ? (
            <ActivityIndicator size="small" />
          ) : isOrderExist ? (
            <View className="flex-row items-center justify-center">
              <Feather name="shopping-cart" size={16} color={ICON_MAIN_COLOR} />
              <Text className="ml-2 text-white font-semibold">ԶԱՄԲՅՈՒՂՈՒՄ</Text>
            </View>
          ) : (
            <Text className="text-center text-white font-bold text-base">
              Ավելացնել զամբյուղում
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <Modal animationType="fade" transparent visible={isDialogOpen}>
        <View
          className="items-center justify-center flex-1"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <View className="p-4 w-full max-h-[90%] max-w-[96%] bg-white/90 backdrop-blur-sm rounded-lg">
            <View className="flex-row justify-between w-full mb-2">
              <Text className="font-semibold">Ընտրեք ապրանքի ավելացման վայրը</Text>
              <TouchableOpacity onPress={toggleDialog}>
                <FontAwesome name="window-close" size={24} color={ICON_MAIN_COLOR} />
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                className={`flex-row p-5 my-1 w-full rounded bg-white ${
                  isSelected === 'personal-cart' ? 'border border-orange-400' : ''
                } ${isAdminOrderExist ? 'opacity-50' : ''}`}
                disabled={isAdminOrderExist}
                onPress={() => handleCartSelection('personal-cart')}>
                <Text className="mx-2">
                  Անձնական զամբյուղ {isAdminOrderExist ? '(ԶԱՄԲՅՈՒՂՈՈՒՄ)' : ''}
                </Text>
              </TouchableOpacity>
              <View
                className={`p-5 my-1 w-full space-y-1 rounded bg-white ${
                  isSelected === 'administration-cart' ? 'border border-orange-400' : ''
                }`}>
                <TouchableOpacity onPress={() => handleCartSelection('administration-cart')}>
                  <Text className="mx-2">Ադմինիստրային զամբյուղ</Text>
                </TouchableOpacity>
                {isSelected === 'administration-cart' ? (
                  <View className="mx-2">
                    <FlatList
                      data={orders.items}
                      renderItem={renderItem}
                      keyExtractor={(item) => item._id as string}
                      ListEmptyComponent={() =>
                        orders.isLoading ? <ActivityIndicator /> : <Text>Չկա ակտիվ պատվեր</Text>
                      }
                    />
                  </View>
                ) : null}
              </View>
            </View>
            <TouchableOpacity
              className={`p-4 w-full justify-center rounded-lg ${
                isLoading || (isAdminOrderExist && isSelected === 'personal-cart')
                  ? 'bg-gray-400'
                  : 'bg-orange-600'
              }`}
              disabled={!!isLoading || (isAdminOrderExist && isSelected === 'personal-cart')}
              onPress={handleClick}>
              {isLoading ? (
                <ActivityIndicator size="small" />
              ) : (
                <Text className="text-center text-white font-bold">Ավելացնել</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};
