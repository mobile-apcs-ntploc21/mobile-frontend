import { Alert } from 'react-native';

export default function MyAlert() {
  return new Promise<void>((resolve, reject) => {
    Alert.alert(
      'Discard changes',
      'Are you sure you want to discard changes?',
      [
        {
          text: 'No',
          style: 'cancel',
          onPress: () => reject()
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => resolve()
        }
      ]
    );
  });
}
