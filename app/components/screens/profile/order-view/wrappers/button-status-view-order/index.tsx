import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';

import { EOrderStatus } from '../../../../../../redux/types/order';
import { IButtonStatusViewOrder } from '../../types';

export const ButtonStatusViewOrder: React.FC<IButtonStatusViewOrder> = React.memo((props) => {
  const { label, type, handleChangeStatus, isLoading, isDisable } = props;
  const [buttonColor, setButtonColor] = React.useState<string>('bg-orange-400');

  React.useEffect((): void => {
    switch (type) {
      case EOrderStatus.REJECTED:
        setButtonColor('bg-red-600');
        break;
      default:
        break;
    }
  }, [type]);

  return (
    <TouchableOpacity
      className={`rounded p-3 min-h-[49px] mb-2 w-full ${buttonColor} ${isDisable ? 'opacity-70' : ''}`}
      disabled={isLoading || isDisable}
      onPress={() => handleChangeStatus(type)}>
      {isLoading ? (
        <ActivityIndicator size="small" />
      ) : (
        <Text className="text-center text-white text-base">{label}</Text>
      )}
    </TouchableOpacity>
  );
});
ButtonStatusViewOrder.displayName = 'ButtonStatusViewOrder';
