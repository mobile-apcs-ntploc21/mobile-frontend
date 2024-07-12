import { ToastAndroid } from 'react-native';

export function showAlert(message: string) {
  ToastAndroid.showWithGravity(
    message,
    ToastAndroid.SHORT,
    ToastAndroid.CENTER
  );
}
