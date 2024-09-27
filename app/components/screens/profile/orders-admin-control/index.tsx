import { useState } from 'react';
import { View } from 'react-native';
import { ButtonTab } from '../../../ui';
import { Main } from '../../../wrappers';
import { TabKeys } from './types';
import { OrdersAdminActive, OrdersAdminHistory } from './ui';

export const OrdersAdminControl = () => {
  const initialTab: TabKeys = 'active';
  const [activeTab, setActiveTab] = useState<TabKeys>(initialTab);

  const tabs: Record<TabKeys, React.FC> = {
    active: OrdersAdminActive,
    history: OrdersAdminHistory,
  };
  const ActiveComponent = tabs[activeTab];

  const handleTabClick = (tab: TabKeys) => {
    setActiveTab(tab);
  };

  return (
    <Main>
      <View className="flex-row justify-center my-3">
        <ButtonTab
          tabName="Ակտիվ"
          expectedTab="active"
          activeTab={activeTab}
          handleTabClick={handleTabClick}
        />
        <ButtonTab
          tabName="Պատմություն"
          expectedTab="history"
          activeTab={activeTab}
          handleTabClick={handleTabClick}
        />
      </View>
      <ActiveComponent />
    </Main>
  );
};
