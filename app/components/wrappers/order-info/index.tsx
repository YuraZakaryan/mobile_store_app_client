import React from 'react';
import { Text, View } from 'react-native';

import { EPacking } from '../../../redux/types';
import { IOrderInfo } from '../../../types';
import { formatDate } from '../../../utils';
import { OrderInfoItem } from '../../screens/order-completed-view/wrapper/oreder-info-item';

export const OrderInfo: React.FC<IOrderInfo> = React.memo(({ item }) => {
  const totalAmount = item?.items.reduce((acc, item) => acc + item.orderCount * item.price, 0);
  const totalCount = item?.items.reduce((acc, item) => acc + item.orderCount, 0);

  const formattedTotalAmount = totalAmount?.toLocaleString('en-US');
  const orderStatus =
    item.status === 'neutral'
      ? 'Չեզոք'
      : item.status === 'onTheRoad'
        ? 'Ճանապարհին'
        : item.status === 'completed'
          ? 'Ավարտված'
          : 'Անորոշ';

  return (
    <View className="w-full">
      <Text className="text-base font-bold text-gray-500">Ինֆորմացիա</Text>
      <View className="mt-2">
        <OrderInfoItem label="Պատվիրատու" text={item?.user.firstname + ' ' + item?.user.lastname} />
        <OrderInfoItem label="Հեռախոսահամար" text={item?.user.phone} />
        <OrderInfoItem label="Կարգավիճակը" text={orderStatus} />
        <OrderInfoItem label="Ընդհանուր գինը" text={`${formattedTotalAmount} ․դր`} />
        <OrderInfoItem
          label="Փաթեթավորման տեսակը"
          text={
            item?.packaging === EPacking.BAG
              ? 'Տոպրակ'
              : item?.packaging === EPacking.BOX
                ? 'Արկղ'
                : 'Անորոշ'
          }
        />
        <OrderInfoItem label="Ընդհանուր քանակը" text={totalCount as number} />
        <OrderInfoItem
          label="Պատվերի ստեղծում"
          text={formatDate(item?.created_at as string)}
          textClassName="text-[11px]"
        />
        <OrderInfoItem
          label="Պատվերի հաստատում"
          text={formatDate(item?.orderStartTime as string)}
          textClassName="text-[11px]"
        />
        <OrderInfoItem
          label="Պատվերի ընդունում"
          text={formatDate(item?.orderStartTime as string)}
          textClassName="text-[11px]"
        />
        {!item?.orderCompletedTime && (
          <OrderInfoItem
            label="Պատվերի առաքում"
            text={formatDate(item?.orderCompletedTime as string)}
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
