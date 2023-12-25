import { Foundation, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView, ScrollView, View } from 'react-native';

import { ItemsByCategory } from './ui';
import { useAppSelector } from '../../../hooks/redux';
import { TProduct } from '../../../redux/types';
import { filterItemsByDiscount, filterProductsLastDays } from '../../../utils/product';

export const Home = () => {
  const { items } = useAppSelector((state) => state.product);

  const filterLastDays: TProduct[] = filterProductsLastDays(items);
  const filterDiscount: TProduct[] = filterItemsByDiscount(items);

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="mx-4 mb-3">
          <ItemsByCategory
            products={filterLastDays}
            categoryTitle="Նոր տեսականի"
            icon={<Foundation name="burst-new" size={34} color="blue" />}
          />
          <ItemsByCategory
            products={filterDiscount}
            categoryTitle="Զեղչեր"
            icon={<MaterialCommunityIcons name="brightness-percent" size={28} color="blue" />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
