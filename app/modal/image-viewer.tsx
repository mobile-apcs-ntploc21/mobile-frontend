import CrossIcon from '@/assets/icons/CrossIcon';
import DownloadIcon from '@/assets/icons/DownloadIcon';
import IconWithSize from '@/components/IconWithSize';
import { colors } from '@/constants/theme';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { useLayoutEffect, useRef } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ImageViewer from 'react-native-image-zoom-viewer';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useNotification } from '@/services/alert';

export default function ModalScreen() {
  const { image_uri } = useLocalSearchParams<{
    image_uri?: string;
  }>();
  const { showAlert } = useNotification();

  const ref = useRef<ImageViewer>(null);

  const handleSaveImage = async () => {
    console.log(image_uri);
    if (!image_uri) return;

    const fileExtension = image_uri.split('.').pop();
    const fileName = `Orantio_${new Date().getTime()}.${fileExtension}`;

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        showAlert('Permission to access media library is required');
        return;
      }

      const { uri } = await FileSystem.downloadAsync(
        image_uri,
        FileSystem.documentDirectory + fileName
      );
      console.log('Finished downloading to ', uri);

      const asset = await MediaLibrary.createAssetAsync(uri);

      showAlert('Image saved to your gallery');
    } catch (error) {
      console.error(error);
      showAlert('Failed to save image');
    }
  };

  return (
    <ImageViewer
      ref={ref}
      imageUrls={[{ url: image_uri! }]}
      enableSwipeDown={true}
      onSwipeDown={() => router.back()}
      renderIndicator={() => <View />}
      renderHeader={() => (
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <IconWithSize icon={CrossIcon} size={40} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSaveImage}>
            <IconWithSize icon={DownloadIcon} size={40} color={colors.white} />
          </TouchableOpacity>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.black
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 16,
    zIndex: 1
  }
});
