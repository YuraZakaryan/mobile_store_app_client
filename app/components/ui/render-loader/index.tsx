import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { ICON_MAIN_COLOR } from '../../../utils/constants';

export interface IRenderLoader {
  isLoading: boolean;
}

export const RenderLoader: React.FC<IRenderLoader> = ({ isLoading }) => {
  return (
    <>
      {/*{isLoading && (*/}
      <View className="mt-5">
        <ActivityIndicator size="large" color={ICON_MAIN_COLOR} />
      </View>
      {/*)}*/}
    </>
  );
};
