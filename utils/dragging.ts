export const WIDTH = 64;
export const HEIGHT = 64 + 10 + 12;
export const MARGIN_X = 16;
export const MARGIN_Y = 32;
export const COL = 4;

export const getPosition = (index: number) => {
  'worklet';
  const x = index % COL;
  const y = Math.floor(index / COL);
  return {
    x: x * (WIDTH + MARGIN_X),
    y: y * (HEIGHT + MARGIN_Y)
  };
};

export const getOrder = (x: number, y: number) => {
  'worklet';
  const col = Math.round(x / (WIDTH + MARGIN_X));
  const row = Math.round(y / (HEIGHT + MARGIN_Y));
  return row * COL + col;
};
