import MyButtonBase, { MyButtonBaseProps } from './MyButtonBase';
import { IconProps } from '@/types';
import { colors } from '@/constants/theme';

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
    <MyButtonBase {...props}>
      <Icon color={reverseStyle ? backgroundColor : textColor} />
    </MyButtonBase>
  );
};

export default MyButtonIcon;
