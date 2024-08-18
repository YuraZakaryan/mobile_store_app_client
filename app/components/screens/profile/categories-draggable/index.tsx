import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import DragList, { DragListRenderItemInfo } from 'react-native-draglist';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import {
  fetchCategoriesThunk,
  updateCategoriesOrderIndexThunk,
} from '../../../../redux/http/categoryThunk';
import { setSortCategoriesDialogStatus } from '../../../../redux/reducers/category/categorySlice';
import { SHOW_ERROR, SHOW_SUCCESS } from '../../../../toasts';
import { ICON_MAIN_COLOR } from '../../../../utils/constants';
import { TCategoriesWithOrderIndex } from '../categories-control/types';

export default function CategoriesDraggableDialog() {
  const dispatch = useAppDispatch();
  const { categories, sortCategories } = useAppSelector((state) => state.category);

  React.useEffect(() => {
    dispatch(fetchCategoriesThunk());
  }, []);

  const modifiedCategories = React.useCallback(
    () =>
      categories.items.map((category) => ({
        _id: category._id,
        title: category.title,
        orderIndex: category.orderIndex,
      })),
    [categories]
  );

  const [categoriesState, setCategoriesState] = React.useState<TCategoriesWithOrderIndex[]>([]);

  React.useEffect(() => {
    setCategoriesState(modifiedCategories());
  }, [sortCategories.dialogStatus, modifiedCategories]);

  function keyExtractor(item: TCategoriesWithOrderIndex) {
    return item._id;
  }

  function renderItem(info: DragListRenderItemInfo<TCategoriesWithOrderIndex>) {
    const { item, onDragStart, onDragEnd, isActive } = info;

    return (
      <TouchableOpacity
        className={`flex-row p-5 my-1 w-full rounded bg-white ${isActive ? 'border border-gray-200' : ''}`}
        onPressIn={onDragStart}
        onPressOut={onDragEnd}
        delayPressIn={350}
        disabled={isActive}>
        <Text>{item.orderIndex}</Text>
        <Text className="mx-2">{item.title}</Text>
      </TouchableOpacity>
    );
  }

  async function onReordered(fromIndex: number, toIndex: number) {
    const copy = [...categoriesState];
    const removed = copy.splice(fromIndex, 1);

    copy.splice(toIndex, 0, removed[0]);

    const updatedCategories = copy.map((item, index) => ({
      ...item,
      orderIndex: index + 1,
    }));

    setCategoriesState(updatedCategories);
  }

  const handleClose = (): void => {
    dispatch(setSortCategoriesDialogStatus(false));
  };

  const handleSubmit = (): void => {
    dispatch(updateCategoriesOrderIndexThunk(categoriesState))
      .unwrap()
      .then((res) => {
        if (res) {
          SHOW_SUCCESS('Կատեգորիաները հաջողությամբ վերադասավորվեցին');
        }
      })
      .catch(() => {
        SHOW_ERROR('Տեղի է ունեցել խնդիր վերադասավորման հետ կապված');
      });
  };

  function arraysEqual(a: TCategoriesWithOrderIndex[], b: TCategoriesWithOrderIndex[]) {
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
      if (
        a[i]._id !== b[i]._id ||
        a[i].orderIndex !== b[i].orderIndex ||
        a[i].title !== b[i].title
      ) {
        return false;
      }
    }
    return true;
  }

  const isActive: boolean = sortCategories.dialogStatus || false;
  const isDisable: boolean = arraysEqual(categoriesState, modifiedCategories());
  const isLoading: boolean = sortCategories.isLoading || false;

  return (
    <Modal animationType="fade" transparent visible={isActive}>
      <View
        className="items-center justify-center flex-1"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
        <View className="p-4 w-full max-h-[90%] max-w-[96%] bg-white/90 backdrop-blur-sm rounded-lg">
          <View className="flex-row justify-between w-full mb-2">
            <Text className="text-base font-semibold">Վերադասավորել կատեգորիաները</Text>
            <TouchableOpacity onPress={handleClose}>
              <FontAwesome name="window-close" size={25} color={ICON_MAIN_COLOR} />
            </TouchableOpacity>
          </View>
          <View className="flex-row gap-2 items-start mb-4">
            <Text className="text-red-500">*</Text>
            <Text>Սեղմած պահել համապատասխան կատեգորայի վրա և տեղաշարժել</Text>
          </View>

          <ScrollView className="my-2">
            <DragList
              data={categoriesState}
              keyExtractor={keyExtractor}
              onReordered={onReordered}
              renderItem={renderItem}
              scrollEnabled={false}
            />
          </ScrollView>

          <View className="mt-4">
            <TouchableOpacity
              className={`px-6 py-2 self-end rounded min-w-[119px] ${isDisable ? 'bg-slate-500' : 'bg-orange-400'}`}
              disabled={isDisable}
              onPress={handleSubmit}>
              {isLoading ? (
                <View style={{ height: 16 }}>
                  <ActivityIndicator
                    size="small"
                    color="white"
                    style={{ transform: [{ scale: 0.8 }] }}
                  />
                </View>
              ) : (
                <Text className="font-semibold text-white text-xs">Հաստատել</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
