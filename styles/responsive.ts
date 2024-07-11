import { s, vs, ms } from 'react-native-size-matters';

export const rW = (width: number) => s(width);
export const rH = (height: number) => vs(height);
export const rMS = (size: number, factor?: number) => ms(size, factor);
