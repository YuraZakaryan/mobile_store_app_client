import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { IPaginationButtons } from '../../../types';
import { LIMIT_NUMBER } from '../../../utils/constants';

export const PaginationButtons: React.FC<IPaginationButtons> = React.memo((props) => {
  const { handlePrevPage, handleNextPage, nextButtonDisable, previousButtonDisable, total_items } =
    props;

  return (
    <>
      {total_items > LIMIT_NUMBER ? (
        <View className="w-full items-end px-2 py-3">
          <View className="flex-row gap-4">
            <TouchableOpacity
              className={`py-2 px-3 rounded bg-orange-400 justify-center items-center ${
                previousButtonDisable ? 'bg-orange-300' : ''
              }`}
              onPress={handlePrevPage}
              disabled={previousButtonDisable}>
              <Text
                className={`font-semibold text-white ${
                  previousButtonDisable ? 'text-gray-500' : ''
                }`}>
                Նախորդը
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`py-2 px-3 rounded bg-orange-400 justify-center items-center ${
                nextButtonDisable ? 'bg-orange-300' : ''
              }`}
              onPress={handleNextPage}
              disabled={nextButtonDisable}>
              <Text
                className={`font-semibold text-white ${nextButtonDisable ? 'text-gray-500' : ''}`}>
                Հաջորդը
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </>
  );
});
PaginationButtons.displayName = 'PaginationButtons';
