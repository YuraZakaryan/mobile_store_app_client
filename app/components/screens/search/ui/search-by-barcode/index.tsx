import { FontAwesome } from '@expo/vector-icons';
import { useCameraPermissions } from 'expo-camera';

import React from 'react';
import { Image, Modal, Text, TouchableOpacity, View } from 'react-native';
import { useIsTablet } from '../../../../../hooks/useIsTablet';
import { CameraBarCodeView } from '../camera-bar-code-view';

export interface ISearchByBarCode {
  handleSearchChange: (text: string) => void;
}

export const SearchByBarCode: React.FC<ISearchByBarCode> = ({ handleSearchChange }) => {
  const [isModalVisible, setModalVisible] = React.useState<boolean>(false);
  const [permission, requestPermission] = useCameraPermissions();

  const { isTablet } = useIsTablet();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View className="items-center justify-center px-2">
        <TouchableOpacity onPress={requestPermission}>
          <Image
            source={require('./../../../../../assets/icons/bar_code_scan.png')}
            className="w-14 h-14"
          />
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCamera = () => {
    if (!permission) {
      requestPermission();
    }
    if (isTablet !== null) {
      setModalVisible(!isModalVisible);
    }
  };

  const handleBarcodeScanned = (data: string) => {
    if (data) {
      toggleCamera();
    }
    handleSearchChange(data);
    console.log('Scanned data from child:', data);
  };

  return (
    <View>
      <View className="items-center justify-center pl-2">
        <TouchableOpacity onPress={toggleCamera} className="w-14 h-14">
          <Image
            source={require('./../../../../../assets/icons/bar_code_scan.png')}
            className="w-14 h-14"
            tintColor="gray"
          />
        </TouchableOpacity>
      </View>
      <Modal visible={isModalVisible} transparent>
        <View className="w-full items-center">
          <View className="p-2 top-20 absolute z-10">
            <View className="relative">
              <View className="absolute bg-black h-full w-full opacity-60 rounded-md" />
              <Text className={`text-white font-bold p-3 text-${isTablet ? 'base' : 'ms'}`}>
                Սքանավորեք ապրանքի շտրիխ կոդը
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={toggleCamera}
          className="absolute right-5 z-10 opacity-70 top-10">
          <FontAwesome name="window-close" size={isTablet ? 50 : 30} color="white" />
        </TouchableOpacity>
        <CameraBarCodeView оnBarcodeScanned={handleBarcodeScanned} />
      </Modal>
    </View>
  );
};
