import {
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View
} from 'react-native';
import React from 'react';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import IconWithSize from './IconWithSize';
import { Chevron } from '@/constants/images';
import { colors } from '@/constants/theme';
import { Entypo } from '@expo/vector-icons';
import MyText from './MyText';
import { TextStyles } from '@/styles/TextStyles';

interface MyHeaderProps extends NativeStackHeaderProps {
  title?: string;
  headerRight?: React.ReactNode;
}

const MyHeader = (props: MyHeaderProps) => {
  return (
    <View style={styles.container}>
      {props.navigation.canGoBack() && (
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Entypo name="chevron-thin-left" size={32} color={colors.black} />
        </TouchableOpacity>
      )}
      <MyText style={[TextStyles.h2, { flex: 1 }]}>
        {props.title || props.route.name}
      </MyText>
      {props.headerRight}
    </View>
  );
};

export default MyHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 16,
    backgroundColor: colors.white,
    height: 72,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray03
  }
});
