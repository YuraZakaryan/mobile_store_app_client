import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { ETypeError, INetworkError } from '../../../types';

export const NetworkError: React.FC<INetworkError> = React.memo((props) => {
  const { handleRefresh, type = ETypeError.NETWORK } = props;

  return (
    <View className="items-center m-5">
      <View className="flex-row justify-center gap-1">
        <MaterialIcons name="error" size={26} color="black" />
        <Text className="font-bold text-[18px]">
          {type === ETypeError.TECHNICAL ? 'Տեղխնիկական խնդիր' : 'Կապի խնդիր'}
        </Text>
      </View>
      <Text className="font-semibold text-gray-600 italic mt-1 text-center">
        {type === ETypeError.TECHNICAL
          ? 'Սերվերում տարվում են տեխնիկական աշխատանքներ, փորձել մի փոքր ուշ'
          : 'Բջջային ցանցը անջատված է, միացրեք բջջային ցանցը կամ միացրեք ձեր հեռախոսի Wi-Fi֊ը՝ հավելվածն օգտագործելու համար'}
      </Text>
      <TouchableOpacity
        className="px-3 py-2 border border-gray-500 mt-3 rounded-sm justify-center items-center"
        onPress={handleRefresh}>
        <Text className="text-center font-semibold">Կրկին փորձել</Text>
      </TouchableOpacity>
    </View>
  );
});
NetworkError.displayName = 'NetworkError';
