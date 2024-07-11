import { StyleSheet } from 'react-native';
import { fonts } from '@/constants/theme';

export const TextStyles = StyleSheet.create({
  superHeader: {
    fontSize: 30,
    fontFamily: fonts.black,
    lineHeight: 38
  },
  h1: {
    fontSize: 26,
    fontFamily: fonts.black,
    lineHeight: 34
  },
  h2: {
    fontSize: 24,
    fontFamily: fonts.black,
    lineHeight: 32
  },
  h3: {
    fontSize: 20,
    fontFamily: fonts.bold,
    lineHeight: 28
  },
  h4: {
    fontSize: 18,
    fontFamily: fonts.bold,
    lineHeight: 26
  },
  h5: {
    fontSize: 16,
    fontFamily: fonts.bold,
    lineHeight: 24
  },
  bodyXL: {
    fontSize: 16,
    fontFamily: fonts.regular,
    lineHeight: 22
  },
  bodyL: {
    fontSize: 14,
    fontFamily: fonts.regular,
    lineHeight: 20
  },
  bodyM: {
    fontSize: 12,
    fontFamily: fonts.regular,
    lineHeight: 18
  },
  bodyS: {
    fontSize: 10,
    fontFamily: fonts.regular,
    lineHeight: 16
  }
});
