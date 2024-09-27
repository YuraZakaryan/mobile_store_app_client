import React, { useEffect, useRef } from 'react';
import { Animated, Image, View } from 'react-native';
import { useIsTablet } from '../../../../../hooks/useIsTablet';

export const CameraOverlay = () => {
  const anim = useRef(new Animated.Value(1));
  const { isTablet } = useIsTablet();

  useEffect(() => {
    Animated.loop(
      // runs given animations in a sequence
      Animated.sequence([
        // increase size
        Animated.timing(anim.current, {
          toValue: 1.02,
          duration: 100,
          useNativeDriver: true,
        }),
        // decrease size
        Animated.timing(anim.current, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View className="flex-1 justify-center items-center">
      <Animated.View style={{ transform: [{ scale: anim.current }] }}>
        <View className="p-5 shadow-lg opacity-40">
          <Image
            source={require('./../../../../../assets/icons/bar_code_scanner_camera.png')}
            className={`w-${isTablet ? '80' : '52'} h-${isTablet ? '80' : '52'}`}
            tintColor="white"
          />
        </View>
      </Animated.View>
    </View>
  );
};
