import { StyleSheet } from 'react-native';
import { rMS } from './reponsive';
import { fonts } from '@/constants/theme';

export const TextStyles = StyleSheet.create({
  superHeader: {
    fontSize: rMS(30),
    fontFamily: fonts.black,
    lineHeight: rMS(38)
  },
  h1: {
    fontSize: rMS(26),
    fontFamily: fonts.black,
    lineHeight: rMS(34)
  },
  h2: {
    fontSize: rMS(24),
    fontFamily: fonts.black,
    lineHeight: rMS(32)
  },
  h3: {
    fontSize: rMS(20),
    fontFamily: fonts.bold,
    lineHeight: rMS(28)
  },
  h4: {
    fontSize: rMS(18),
    fontFamily: fonts.bold,
    lineHeight: rMS(26)
  },
  h5: {
    fontSize: rMS(16),
    fontFamily: fonts.bold,
    lineHeight: rMS(24)
  },
  bodyXL: {
    fontSize: rMS(16),
    fontFamily: fonts.regular,
    lineHeight: rMS(22)
  },
  bodyL: {
    fontSize: rMS(14),
    fontFamily: fonts.regular,
    lineHeight: rMS(20)
  },
  bodyM: {
    fontSize: rMS(12),
    fontFamily: fonts.regular,
    lineHeight: rMS(18)
  },
  bodyS: {
    fontSize: rMS(10),
    fontFamily: fonts.regular,
    lineHeight: rMS(16)
  }
});
