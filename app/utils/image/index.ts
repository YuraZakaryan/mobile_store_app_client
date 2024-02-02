import * as ImagePicker from 'expo-image-picker';
import { FormikValues } from 'formik';

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
export { pickImageSetFormik };
