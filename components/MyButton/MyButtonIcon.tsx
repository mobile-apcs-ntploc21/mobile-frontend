import MyButtonBase, { MyButtonBaseProps } from './MyButtonBase';
import { IconProps } from '@/types';
import { colors } from '@/constants/theme';
import { rH, rW } from '@/styles/responsive';
import { View } from 'react-native';

interface MyButtonIconProps extends MyButtonBaseProps {
  icon: React.ComponentType<IconProps>;
}

const MyButtonIcon = (props: MyButtonIconProps) => {
  const {
    textColor = colors.white,
    backgroundColor = colors.primary,
    reverseStyle,
    icon: Icon
  } = props;
  return (
    <MyButtonBase
      {...props}
      style={{ minWidth: 0, width: rW(55), height: rH(55) }}
    >
      <Icon color={reverseStyle ? backgroundColor : textColor} />
    </MyButtonBase>
  );
};

export default MyButtonIcon;
