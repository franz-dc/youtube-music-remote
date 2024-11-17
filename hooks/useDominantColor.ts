import { useEffect, useMemo, useState } from 'react';

import Color from 'color';
import { getColors } from 'react-native-image-colors';
import { useTheme } from 'react-native-paper';

type UseDominantColorResult = {
  color: string;
  isBright: boolean;
  imageUrl: string;
};

export const useDominantColor = (imageUrl?: string | null) => {
  const theme = useTheme();

  const fallbackData: UseDominantColorResult = useMemo(
    () => ({
      color: theme.colors.surface,
      isBright: false,
      imageUrl: '',
    }),
    [theme.colors.surface]
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
                isBright: Color(dominantColor).isLight(),
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
