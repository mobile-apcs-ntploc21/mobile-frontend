import ServerList from '@/components/Servers_Channels/ServerList';
import { DefaultCoverImage } from '@/constants/images';
import { colors } from '@/constants/theme';
import { StyleSheet, Text, View, Image } from 'react-native';
import ServerInfo from '../../components/Servers_Channels/ServerInfo';

export default function Servers() {
  return (
    <View style={{ flex: 1 }}>
      <Image source={DefaultCoverImage} style={styles.coverimg} />
      <View style={styles.container}>
        <ServerInfo />
      </View>
      <ServerList />
    </View>
  );
}

const styles = StyleSheet.create({
  coverimg: {
    width: '100%',
    height: 177
  },
  container: {
    position: 'absolute',
    width: '100%',
    top: 136,
    bottom: 0,
    backgroundColor: colors.gray04,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  }
});
