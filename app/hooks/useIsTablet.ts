import * as Device from 'expo-device';
import { useEffect, useState } from 'react';

interface IUseIsTabletHook {
  isTablet: boolean | null;
  executeAfterDeviceCheck: (callback: () => void) => void;
}

export const useIsTablet = (): IUseIsTabletHook => {
  const [isTablet, setIsTablet] = useState<boolean | null>(null);

  useEffect(() => {
    const checkDeviceType = async () => {
      const deviceType = await Device.getDeviceTypeAsync();
      setIsTablet(deviceType === Device.DeviceType.TABLET);
    };

    checkDeviceType();
  }, []);

  const executeAfterDeviceCheck = (callback: () => void) => {
    if (isTablet !== null) {
      callback();
    }
  };

  return { isTablet, executeAfterDeviceCheck };
};
