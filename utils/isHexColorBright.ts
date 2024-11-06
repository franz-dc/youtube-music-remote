import { hexToRgb } from './hexToRgb';
import { rgbToHsl } from './rgbToHsl';

export const isHexColorBright = (hex: string) => {
  const [, , l] = rgbToHsl(...hexToRgb(hex));
  return l > 0.5;
};
