import { Platform, ToastAndroid } from 'react-native';

export function showAlert(message: string) {
  if (Platform.OS === 'android') {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
  } else {
    alert(message);
  }
}
