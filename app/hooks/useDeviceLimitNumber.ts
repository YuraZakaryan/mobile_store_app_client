import * as Device from 'expo-device';
import { useEffect, useState } from 'react';
import { getLimitNumber } from '../utils/constants';

export const useDeviceLimitNumber = (): number => {
  const [limitNumber, setLimitNumber] = useState<number>(0);

  useEffect(() => {
    const checkDeviceType = async () => {
      const deviceType = await Device.getDeviceTypeAsync();
      const isTablet = deviceType === Device.DeviceType.TABLET;
      const limit = getLimitNumber(isTablet);
      setLimitNumber(limit);
    };

    checkDeviceType();
  }, []);

  return limitNumber;
};
