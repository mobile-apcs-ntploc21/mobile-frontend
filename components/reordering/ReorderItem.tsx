import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MyText from '../MyText';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { TextStyles } from '@/styles/TextStyles';

interface ReorderItemProps {
  text: string;
  onPressUp: () => void;
  onPressDown: () => void;
}

const ReorderItem = (props: ReorderItemProps) => {
  return (
    <View style={styles.container}>
      <MyText style={TextStyles.bodyXL}>{props.text}</MyText>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.action} onPress={props.onPressUp}>
          <FontAwesome5 name="chevron-up" size={16} color={colors.gray01} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.action} onPress={props.onPressDown}>
          <FontAwesome5 name="chevron-down" size={16} color={colors.gray01} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ReorderItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  actions: {
    flexDirection: 'row',
    gap: 8
  },
  action: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors.gray01
  }
});
