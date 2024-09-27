import { CameraView } from 'expo-camera';

import React, { useEffect, useRef } from 'react';
import { AppState, Platform, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { ICameraBarCodeView } from '../../types';
import { CameraOverlay } from '../camera-overlay';

export const CameraBarCodeView: React.FC<ICameraBarCodeView> = (props) => {
  const { оnBarcodeScanned } = props;
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    оnBarcodeScanned(data);
  };

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      {Platform.OS === 'android' ? <StatusBar hidden /> : null}
      <CameraView className="flex-1" facing="back" onBarcodeScanned={handleBarcodeScanned}>
        <CameraOverlay />
      </CameraView>
    </SafeAreaView>
  );
};
