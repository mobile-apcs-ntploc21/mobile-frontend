import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import MyHeader from './MyHeader';
import MyText from './MyText';
import MyAlert from '@/utils/alert';
import { colors, fonts } from '@/constants/theme';

interface MyHeaderRightProps extends NativeStackHeaderProps {
  headingText: string;
  headingRightText: string;
  onRightPress?: () => void;
  showAlert?: boolean;
}

const MyHeaderRight = (props: MyHeaderRightProps) => {
  return (
    <MyHeader
      {...props}
      title="Reorder Categories"
      headerRight={
        <TouchableOpacity onPress={props.onRightPress}>
          <MyText style={styles.headingText}>Save</MyText>
        </TouchableOpacity>
      }
      onGoBack={props.showAlert ? MyAlert : undefined}
    />
  );
};

export default MyHeaderRight;

const styles = StyleSheet.create({
  headingText: {
    color: colors.primary,
    fontSize: 20,
    fontFamily: fonts.medium
  }
});
