import MyButtonBase, { MyButtonBaseProps } from './MyButtonBase';
import { IconProps } from '@/types';
import { colors } from '@/constants/theme';
import { View, StyleSheet } from 'react-native';

interface MyButtonIconProps extends MyButtonBaseProps {
  icon: React.ComponentType<IconProps>;
}

const MyButtonIcon = (props: MyButtonIconProps) => {
  const {
    backgroundColor = colors.gray03,
    textColor = colors.gray01,
    icon: Icon
  } = props;
  const combinedStyles = StyleSheet.flatten([
    { color: props.reverseStyle ? backgroundColor : textColor },
    props.textStyle
  ]);
  return (
    <MyButtonBase
      {...props}
      {...{ backgroundColor, textColor }}
      style={combinedStyles}
      containerStyle={StyleSheet.flatten([
        styles.container,
        props.containerStyle
      ])}
    >
      <Icon color={props.reverseStyle ? backgroundColor : textColor} />
    </MyButtonBase>
  );
};

export default MyButtonIcon;

const styles = StyleSheet.create({
  container: {
    minWidth: 0,
    width: 55,
    height: 55,
    padding: 10
  }
});
