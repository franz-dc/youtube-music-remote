import { useEffect, useMemo, useState } from 'react';

import { getColors } from 'react-native-image-colors';
import { useTheme } from 'react-native-paper';

import { DOMINANT_COLOR_FALLBACK } from '@/constants';
import { isHexColorBright } from '@/utils';

type UseDominantColorResult = {
  color: string;
  isBright: boolean;
  imageUrl: string;
};

export const useDominantColor = (imageUrl?: string | null) => {
  const theme = useTheme();

  const fallbackData: UseDominantColorResult = useMemo(
    () => ({
      color: DOMINANT_COLOR_FALLBACK[theme.dark ? 'dark' : 'light'],
      isBright: false,
      imageUrl: '',
    }),
    [theme.dark]
  );

  const [data, setData] = useState<UseDominantColorResult>(fallbackData);

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
            : fallbackData
        );
      } catch (error) {
        console.error(error);
        setData(fallbackData);
      }
    };

    getDominantColor();
  }, [imageUrl, fallbackData]);

  return data;
};
