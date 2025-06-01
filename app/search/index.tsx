import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { List, Text, useTheme } from 'react-native-paper';
import { getTouchableRippleColors } from 'react-native-paper/src/components/TouchableRipple/utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  SceneRendererProps,
  TabBar,
  TabView,
  TabViewProps,
} from 'react-native-tab-view';

import {
  InfoView,
  LoadingView,
  MusicCardShelf,
  SearchResultItem,
  SearchResultMenu,
  SearchResultMenuMethods,
} from '@/components';
import { useQueue, useSearch } from '@/hooks';
import { SearchResultSong } from '@/schemas';
import { addSongToQueue, playNextTrack } from '@/services';
import { pollQueue } from '@/utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
});

type Route = {
  key: string;
  title: string;
};

type RenderSceneProps = SceneRendererProps & {
  route: Route;
};

const StyledTabBar: TabViewProps<Route>['renderTabBar'] = (props) => {
  const theme = useTheme();

  return (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: 'white' }}
      style={{
        backgroundColor: theme.colors.background,
        shadowColor: theme.colors.background,
      }}
      android_ripple={{
        color: getTouchableRippleColors({ theme }).calculatedRippleColor,
      }}
    />
  );
};

const NoResults = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'search' });

  return (
    <InfoView
      title={t('noResults')}
      message={t('noResultsMessage')}
      icon='magnify'
    />
  );
};

const Search = () => {
  const { bottom: bottomInset } = useSafeAreaInsets();

  const { t } = useTranslation('translation');

  const { refetch: refetchQueue } = useQueue();

  const { q } = useLocalSearchParams<{ q: string }>();
  const {
    data: searchResults,
    isLoading,
    isError,
    refetch,
  } = useSearch({ query: q });

  const handleSelectSong = useCallback(
    async ({
      videoId,
      action,
    }: {
      videoId: string;
      action: 'play' | 'addToQueue' | 'playNext';
    }) => {
      // The API does not support playing a song directly via its ID.
      // Workaround: Insert song next to the current song in the queue,
      // then, play the next song in the queue (newly added song).
      switch (action) {
        case 'play': {
          await addSongToQueue(videoId, 'INSERT_AFTER_CURRENT_VIDEO');
          await pollQueue(videoId, refetchQueue, async () => {
            await playNextTrack();
          });
          break;
        }
        case 'addToQueue': {
          await addSongToQueue(videoId, 'INSERT_AT_END');
          await pollQueue(videoId, refetchQueue);
          break;
        }
        case 'playNext': {
          await addSongToQueue(videoId, 'INSERT_AFTER_CURRENT_VIDEO');
          await pollQueue(videoId, refetchQueue);
          break;
        }
      }
    },
    [refetchQueue]
  );

  // more actions handler
  const [selectedSong, setSelectedSong] = useState<SearchResultSong | null>(
    null
  );
  const searchResultMenuRef = useRef<SearchResultMenuMethods>(null);

  useEffect(() => {
    if (selectedSong) {
      searchResultMenuRef.current?.show();
    }
  }, [selectedSong]);

  // tab
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const routes: Route[] = useMemo(
    () =>
      (searchResults || []).map((result, index) => ({
        key: index.toString(),
        title: result.category.toUpperCase(),
      })),
    [searchResults]
  );

  const renderScene = useCallback(
    ({ route }: RenderSceneProps) => {
      const contents = (searchResults || [])[parseInt(route.key)].contents;

      if (contents.length === 0) {
        return <NoResults />;
      }

      return (
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: bottomInset }}
        >
          {contents.map((shelf) => (
            <View key={shelf.header}>
              <Text
                style={{
                  marginHorizontal: 16,
                  fontSize: 20,
                  fontWeight: 'bold',
                }}
              >
                {shelf.header}
              </Text>
              {shelf.type === 'musicCardShelfRenderer' && (
                <MusicCardShelf
                  {...shelf}
                  onSelect={handleSelectSong}
                  onMoreActionsOpen={setSelectedSong}
                />
              )}
              {shelf.type === 'musicShelfRenderer' && (
                <List.Section
                  style={{
                    marginBottom: 16,
                  }}
                >
                  {shelf.contents.map((item) => (
                    <SearchResultItem
                      key={item.videoId}
                      onSelect={handleSelectSong}
                      onMoreActionsOpen={setSelectedSong}
                      {...item}
                    />
                  ))}
                </List.Section>
              )}
            </View>
          ))}
        </ScrollView>
      );
    },
    [searchResults, bottomInset, handleSelectSong]
  );

  if (isLoading) {
    return <LoadingView />;
  }

  if (isError) {
    return (
      <InfoView
        title={t('common.somethingWentWrong')}
        message={t('search.errorMessage')}
        icon='image-broken-variant'
        onActionPress={refetch}
        actionLabel={t('retry')}
      />
    );
  }

  if (searchResults) {
    switch (searchResults.length) {
      case 0: {
        return <NoResults />;
      }
      case 1: {
        return renderScene({
          route: { key: '0', title: searchResults[0].category },
        } as RenderSceneProps);
      }
      default: {
        return (
          <>
            <TabView
              navigationState={{ index, routes }}
              onIndexChange={setIndex}
              initialLayout={{ width: layout.width }}
              renderScene={renderScene}
              renderTabBar={StyledTabBar}
            />
            {selectedSong && (
              <SearchResultMenu
                ref={searchResultMenuRef}
                song={selectedSong}
                onSongActionSelect={handleSelectSong}
              />
            )}
          </>
        );
      }
    }
  }

  return null;
};

export default Search;
