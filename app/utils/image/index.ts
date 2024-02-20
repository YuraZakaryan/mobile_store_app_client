import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { FormikValues } from 'formik';

import { TCustomFileType } from '../../types';

const pickImageSetFormik = async (setFieldValue: FormikValues['setFieldValue'], name: string) => {
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permissionResult.granted) {
    alert('Չկան բավարար իրավունքներ, լուսանկան պատկերասրահ մուտք գործելու համար');
  } else {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const localUri = result.assets[0].uri;
      const filename = localUri.split('/').pop();

      const match = /\.(\w+)$/.exec(filename as string);
      const type = match ? `image/${match[1]}` : 'image';

      const file = {
        uri: localUri,
        name: filename,
        type,
      };

      setFieldValue(name, file);
    }
  }
};

const pickDocument = async (handlePick: (file: TCustomFileType) => void): Promise<void> => {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    copyToCacheDirectory: true,
  });

  if (!result.canceled) {
    const name = result.assets[0].name;
    const size = result.assets[0].size !== undefined ? result.assets[0].size : 0;
    const localUri = result.assets[0].uri;
    const nameParts = name.split('.');
    const fileType = nameParts[nameParts.length - 1];

    const file = {
      name,
      size,
      uri: localUri,
      type: 'application/' + fileType,
    };

    handlePick(file);
  }
};
export { pickImageSetFormik, pickDocument };
