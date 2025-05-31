import { forwardRef, useImperativeHandle, useRef } from 'react';

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import { Image, Platform, StyleSheet, View } from 'react-native';
import { Divider, List, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ANIMATION_CONFIGS } from '@/constants';
import { useBottomSheetModalBackHandler } from '@/hooks';
import { SearchResultSong } from '@/schemas';

type SongAction = 'addToQueue' | 'playNext';

export type SearchResultMenuProps = {
  song: SearchResultSong;
  onSongActionSelect: (params: {
    videoId: string;
    action: SongAction;
  }) => Promise<void> | void;
};

export type SearchResultMenuMethods = {
  show: () => void;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomSheetModal: {
    marginHorizontal: 24,
  },
  listItem: {
    paddingHorizontal: 16,
  },
  divider: {
    marginTop: 16,
    marginBottom: 8,
  },
  albumArtContainer: {
    position: 'relative',
    width: 48,
    height: 48,
    overflow: 'hidden',
    borderRadius: 4,
  },
  albumArt: {
    width: 48,
    height: 48,
  },
});

const SearchResultMenu = forwardRef<
  SearchResultMenuMethods,
  SearchResultMenuProps
>(({ song, onSongActionSelect }, ref) => {
  const { t } = useTranslation('translation', { keyPrefix: 'search' });

  const { bottom: bottomInset } = useSafeAreaInsets();

  const theme = useTheme();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handlePresentModalPress = () => {
    bottomSheetModalRef.current?.present();
    bottomSheetModalRef.current?.snapToIndex(0);
  };
  const handleDismissModalPress = () => bottomSheetModalRef.current?.dismiss();

  useImperativeHandle(ref, () => ({
    show: handlePresentModalPress,
  }));

  const { handleSheetPositionChange } =
    useBottomSheetModalBackHandler(bottomSheetModalRef);

  const handleSongActionSelect = async (action: SongAction) => {
    handleDismissModalPress();
    await onSongActionSelect({
      videoId: song.videoId,
      action,
    });
  };

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        onChange={handleSheetPositionChange}
        animationConfigs={ANIMATION_CONFIGS}
        handleIndicatorStyle={{ backgroundColor: theme.colors.onSurface }}
        style={styles.bottomSheetModal}
        backgroundStyle={{ backgroundColor: theme.colors.elevation.level4 }}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
          />
        )}
        enableDismissOnClose={false}
      >
        <BottomSheetScrollView
          contentContainerStyle={{
            paddingBottom: bottomInset + (Platform.OS === 'web' ? 16 : 8),
          }}
        >
          <View style={{ flexDirection: 'row', paddingHorizontal: 16 }}>
            <View
              style={[
                styles.albumArtContainer,
                { backgroundColor: theme.dark ? '#000000' : '#ffffff' },
              ]}
            >
              <Image
                source={{ uri: song.thumbnail }}
                style={[styles.albumArt]}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                numberOfLines={1}
                style={{
                  paddingHorizontal: 16,
                  fontWeight: 'bold',
                }}
              >
                {song.title}
                {song.title}
                {song.title}
                {song.title}
                {song.title}
                {song.title}
                {song.title}
                {song.title}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  paddingHorizontal: 16,
                  opacity: 0.5,
                }}
              >
                {song.subtitle}
              </Text>
            </View>
          </View>
          <Divider style={styles.divider} />
          <List.Item
            title={t('playNext')}
            left={() => <List.Icon icon='playlist-play' />}
            onPress={() => handleSongActionSelect('playNext')}
            style={styles.listItem}
          />
          <List.Item
            title={t('addToQueue')}
            left={() => <List.Icon icon='playlist-music' />}
            onPress={() => handleSongActionSelect('addToQueue')}
            style={styles.listItem}
          />
        </BottomSheetScrollView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
});

SearchResultMenu.displayName = 'SearchResultMenu';

export default SearchResultMenu;
