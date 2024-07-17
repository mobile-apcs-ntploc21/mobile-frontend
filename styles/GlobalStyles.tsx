import { colors } from '@/constants/theme';
import { StyleSheet } from 'react-native';

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
  }
});
