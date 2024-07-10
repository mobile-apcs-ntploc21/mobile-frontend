import { colors, fonts } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  titleContainer: {
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.black
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.black
  },
  contentContainer: {
    gap: 48,
    alignItems: 'center',
    width: '100%'
  },
  fieldContainer: {
    gap: 8,
    width: '100%'
  },
  buttonContainer: {
    width: 214,
    gap: 8
  },
  button: {
    backgroundColor: colors.primary,
    padding: 8,
    borderRadius: 50,
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.white
  }
});
