import React from 'react';
import { Image, Text, View } from 'react-native';

import { API_URL } from '../../../../../../utils/constants';
import { IProductRenderContent } from '../../types';

export const ProductRenderContent: React.FC<IProductRenderContent> = React.memo((props) => {
  const { title, picture, index } = props;

  return (
    <>
      <View className="flex-row items-center gap-2">
        <Text className="font-semibold">{index + 1}.</Text>
        <Text className="min-w-[85px] w-36" numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
      </View>
      {picture && (
        <Image
          source={{ uri: `${API_URL + '/' + picture}` }}
          alt={title}
          className="w-10 h-10 rounded"
        />
      )}
    </>
  );
});
ProductRenderContent.displayName = 'ProductRenderContent';
