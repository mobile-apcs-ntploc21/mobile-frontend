import { colors } from '@/constants/theme';
import { StyleSheet } from 'react-native';
import { TextStyles } from './TextStyles';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white
  },
  floatUIShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.25,
    elevation: 5
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.gray01_50
  },
  container: {
    paddingHorizontal: 16
  },
  smallButtonContainer: {
    height: 40,
    borderRadius: 20
  },
  smallButtonText: {
    ...TextStyles.h3
  }
});
