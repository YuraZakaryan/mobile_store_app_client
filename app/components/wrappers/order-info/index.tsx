import React from 'react';
import { Text, View } from 'react-native';

import { EPackage } from '../../../redux/types/order';
import { IOrderInfo } from '../../../types';
import { formatDate } from '../../../utils';
import { formattedPrice, getOrderStatus } from '../../../utils/product';
import { OrderInfoItem } from '../../screens/profile/order-completed-view/wrapper/oreder-info-item';

export const OrderInfo: React.FC<IOrderInfo> = React.memo((props) => {
  const { item, totalAmount } = props;
  const totalCount = item?.items.reduce((acc, item) => {
    if (item.product) {
      return acc + item.itemCount;
    }
    return acc;
  }, 0);

  const orderStatus = getOrderStatus(item.status);

  return (
    <View className="w-full">
      <Text className="text-base font-bold text-gray-500">Ինֆորմացիա</Text>
      <View className="mt-2">
        <OrderInfoItem
          label="Պատվիրատու"
          text={item.author?.firstname + ' ' + item.author?.lastname}
        />
        <OrderInfoItem label="Հեռախոսահամար" text={item.author?.phone as string} />
        <OrderInfoItem label="Հասցե" text={item.author?.address as string} />
        <OrderInfoItem label="Կարգավիճակը" text={orderStatus} />
        <OrderInfoItem label="Ընդհանուր գինը" text={`${formattedPrice(totalAmount)} ․դր`} />
        <OrderInfoItem
          label="Փաթեթավորման տեսակը"
          text={
            item?.packaging === EPackage.BAG
              ? 'Տոպրակ'
              : item?.packaging === EPackage.BOX
                ? 'Արկղ'
                : 'Անորոշ'
          }
        />
        <OrderInfoItem label="Ընդհանուր քանակը" text={totalCount as number} />
        <OrderInfoItem
          label="Պատվերի ստեղծում"
          text={formatDate(item?.createdAt as string)}
          textClassName="text-[11px]"
        />
        {item?.confirmedTime && (
          <OrderInfoItem
            label="Պատվերի հաստատում"
            text={formatDate(item?.confirmedTime as string)}
            textClassName="text-[11px]"
          />
        )}

        {item?.acceptedTime && (
          <OrderInfoItem
            label="Պատվերի ընդունում"
            text={formatDate(item?.acceptedTime as string)}
            textClassName="text-[11px]"
          />
        )}

        {item?.deliveredTime && (
          <OrderInfoItem
            label="Պատվերի առաքում"
            text={formatDate(item?.deliveredTime as string)}
            textClassName="text-[11px]"
          />
        )}

        {item?.necessaryNotes ? (
          <View className="bg-white mb-2 p-3 w-full rounded-lg">
            <Text className="text-gray-400">Գրառում պատվիրատուի կողմից</Text>
            <Text>{item?.necessaryNotes}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
});
OrderInfo.displayName = 'OrderInfo';
