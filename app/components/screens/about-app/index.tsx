import Constants from 'expo-constants';
import React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';

import { Main } from '../../wrappers';

export const AboutApp = () => {
  // Retrieve the version from Constants.expoConfig or fallback to 'N/A' if it's undefined or null
  const version: string = Constants.expoConfig?.version || 'N/A';

  return (
    <Main>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View className="flex-1 w-full justify-center items-center my-10">
          <View className="items-center">
            <Image
              source={require('./../../../assets/images/app_logo.png')}
              className="object-contain w-[300px] h-48"
            />

            <Text className="text-3xl font-bold">Mobiart</Text>
            <Text className="font-semibold text-gray-600">Տարբերակը {version}</Text>
          </View>

          <View className="p-6 mx-auto">
            <Text className="text-base font-semibold text-gray-600">
              Բարի գալուստ`, <Text className="text-orange-600 font-semibold">Mobiart</Text>-ում մենք
              մասնագիտացած ենք վերջին սմարթֆոնների, աքսեսուարների և գաջեթների տրամադրման մեջ՝ ձեր
              տեխնոլոգիական կարիքները բավարարելու համար
            </Text>
            <View className="mt-3">
              <Text className="text-base text-gray-600 font-semibold">
                <Text className="text-orange-600 font-semibold">Mobiart</Text>-ը ապահովում է ձեր
                հարմարավետությունը երկու առաջատար խանութներով, որոնք գտնվում են Երևանի սրտում:
                Այցելեք մեզ հետևյալ հասցեներով՝
              </Text>
              <Text className="text-orange-600 font-semibold text-base">
                Երեւան, Արշակունյաց պողոտա, 34/3
              </Text>
              <Text className="text-orange-600 font-semibold text-base">
                Պռոսպեկտ Տիգրան Մեծ, Երևան, 18
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </Main>
  );
};
