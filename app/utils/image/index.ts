import * as ImagePicker from 'expo-image-picker';
import { FormikValues } from 'formik';

const pickImageSetFormik = async (setFieldValue: FormikValues['setFieldValue'], name: string) => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [5, 4],
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
};
export { pickImageSetFormik };
