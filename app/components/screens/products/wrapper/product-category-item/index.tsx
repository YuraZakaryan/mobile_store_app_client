import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '../../../../../hooks/redux';
import { setCategory } from '../../../../../redux/reducers/category/categorySlice';
import { API_URL } from '../../../../../utils/constants';
import { IProductCategoryItem } from '../../types';

export const ProductCategoryItem: React.FC<IProductCategoryItem> = React.memo((props) => {
  const { item, setProductCurrentPage } = props;
  const dispatch = useAppDispatch();
  const { chosen } = useAppSelector((state) => state.category);

  const handleChose = (): void => {
    setProductCurrentPage(1);
    dispatch(setCategory({ _id: item._id, title: item.title }));
  };
  return (
    <TouchableOpacity onPress={handleChose} className="w-full">
      <View
        key={item._id}
        className={`p-3  w-full border-b border-gray-400 justify-center items-center${
          chosen._id === item._id ? ' bg-gray-500' : ''
        }`}>
        <Image
          source={{ uri: `${API_URL}/${item.picture}` ?? '' }}
          className="w-14 h-14"
          alt={item.title}
        />
      </View>
    </TouchableOpacity>
  );
});
ProductCategoryItem.displayName = 'ProductCategoryItem';
