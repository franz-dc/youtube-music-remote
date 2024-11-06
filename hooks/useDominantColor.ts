import { useEffect, useState } from 'react';

import { getColors } from 'react-native-image-colors';

import { DOMINANT_COLOR_FALLBACK } from '@/constants';
import { isHexColorBright } from '@/utils';

type UseDominantColorResult = {
  color: string;
  isBright: boolean;
  imageUrl: string;
};

const FALLBACK_DATA: UseDominantColorResult = {
  color: DOMINANT_COLOR_FALLBACK,
  isBright: false,
  imageUrl: '',
};

export const useDominantColor = (imageUrl?: string | null) => {
  const [data, setData] = useState<UseDominantColorResult>(FALLBACK_DATA);

  useEffect(() => {
    if (!imageUrl) return;

    const getDominantColor = async () => {
      try {
        const colors = await getColors(imageUrl);
        // @ts-ignore: dominant - android/web; primary - ios
        const dominantColor: string = colors?.dominant || colors?.primary;
        setData(
          dominantColor
            ? {
                color: dominantColor,
                isBright: isHexColorBright(dominantColor),
                imageUrl,
              }
            : FALLBACK_DATA
        );
      } catch (error) {
        console.error(error);
        setData(FALLBACK_DATA);
      }
    };

    getDominantColor();
  }, [imageUrl]);

  return data;
};
