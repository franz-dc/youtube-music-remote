import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { FlashList } from '@shopify/flash-list';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  ActivityIndicator,
  Chip,
  IconButton,
  List,
  useTheme,
} from 'react-native-paper';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  SlideInUp,
  SlideOutUp,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SceneRendererProps, TabView } from 'react-native-tab-view';

import {
  InfoView,
  LoadingView,
  MusicCardShelf,
  SearchResultItem,
  SearchResultMenu,
  SearchResultMenuMethods,
  TabBar,
} from '@/components';
import { useCategorySearch, useQueue, useSearch } from '@/hooks';
import { SearchResultSong } from '@/schemas';
import { addSongToQueue, playNextTrack } from '@/services';
import { pollQueue } from '@/utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  categoriesWrapper: {
    position: 'absolute',
    bottom: -66, // -(34 chip height + 16 margin)
    left: 0,
    right: 0,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    margin: 16,
  },
  categoryLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
  },
});

type Route = {
  key: string;
  title: string;
};

type RenderSceneProps = SceneRendererProps & {
  route: Route;
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

const CategorizedSearchResults = ({
  q,
  params,
  hasCategories,
  handleSelectSong,
  setSelectedSong,
  setShowCategoryLine,
}: {
  q: string;
  params: string;
  hasCategories: boolean;
  handleSelectSong: (params: {
    videoId: string;
    action: 'play' | 'addToQueue' | 'playNext' | 'removeFromQueue';
  }) => Promise<void>;
  setSelectedSong: Dispatch<SetStateAction<SearchResultSong | null>>;
  setShowCategoryLine: Dispatch<SetStateAction<boolean>>;
}) => {
  const { bottom: bottomInset } = useSafeAreaInsets();

  const {
    data: categorizedSearchResults,
    isLoading: isLoadingCategorizedSearchResults,
    fetchNextPage,
    isFetchingNextPage,
  } = useCategorySearch({
    query: q,
    params,
  });

  if (isLoadingCategorizedSearchResults) {
    return <LoadingView />;
  }

  const categorizedContents =
    categorizedSearchResults?.pages.flatMap((page) => page?.contents || []) ||
    [];

  if (categorizedContents.length === 0) {
    return <NoResults />;
  }

  return (
    <View style={{ flex: 1 }}>
      {hasCategories && <View style={{ height: 66 }} />}
      <FlashList
        data={categorizedContents}
        renderItem={({ item, index }) => (
          <SearchResultItem
            key={`${item.videoId}-${index}`}
            onSelect={handleSelectSong}
            onMoreActionsOpen={setSelectedSong}
            {...item}
          />
        )}
        keyExtractor={(item, idx) => `${item.videoId}-${idx}`}
        estimatedItemSize={64}
        contentContainerStyle={{
          paddingBottom: bottomInset,
        }}
        onScroll={(e) => {
          setShowCategoryLine(e.nativeEvent.contentOffset.y > 0);
        }}
        scrollEventThrottle={16}
        onEndReached={fetchNextPage}
        onEndReachedThreshold={1}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator
              animating
              size='large'
              style={{ marginVertical: 16 }}
            />
          ) : null
        }
      />
    </View>
  );
};

const Search = () => {
  const { bottom: bottomInset } = useSafeAreaInsets();
  const { t } = useTranslation('translation');
  const theme = useTheme();
  const { refetch: refetchQueue } = useQueue();

  const [showCategoryLine, setShowCategoryLine] = useState(false);
  const [tabSelectedCategoryIds, setTabSelectedCategoryIds] = useState<
    Record<number, string | undefined>
  >({}); // key: tabIndex, value: categoryId

  // tab
  const layout = useWindowDimensions();
  const [tabIndex, setTabIndex] = useState(0);

  const { q } = useLocalSearchParams<{ q: string }>();
  const {
    data: searchResults,
    isLoading: isLoadingSearchResults,
    isError: isErrorSearchResults,
    refetch: refetchSearchResults,
  } = useSearch({ query: q });

  const handleSelectSong = useCallback(
    async ({
      videoId,
      action,
    }: {
      videoId: string;
      action: 'play' | 'addToQueue' | 'playNext' | 'removeFromQueue';
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
      const localTabIndex = parseInt(route.key);
      const tab = (searchResults || [])[localTabIndex];
      const contents = tab?.contents || [];
      const hasCategories = tab?.categories.length > 0;
      const selectedCategoryId = tabSelectedCategoryIds[localTabIndex];

      if (contents.length === 0) {
        return <NoResults />;
      }

      if (!selectedCategoryId) {
        return (
          <ScrollView
            style={[
              styles.container,
              Platform.OS === 'web' && {
                marginTop: hasCategories ? 66 : 0,
                paddingTop: 0,
              },
            ]}
            contentContainerStyle={{ paddingBottom: bottomInset }}
            onScroll={(e) => {
              setShowCategoryLine(e.nativeEvent.contentOffset.y > 0);
            }}
            scrollEventThrottle={16}
          >
            {hasCategories && Platform.OS !== 'web' && (
              <View style={{ height: 50 }} />
            )}
            {contents.map((shelf) => (
              <View key={shelf.type}>
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
                      marginTop: 0,
                      marginBottom: 16,
                    }}
                  >
                    {shelf.contents.map((item, idx) => (
                      <SearchResultItem
                        // Ideally, the key should just be item.videoId,
                        // but YouTube always returns duplicate videoIds
                        key={`${item.videoId}-${idx}`}
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
      }

      return (
        <CategorizedSearchResults
          q={q}
          params={selectedCategoryId}
          hasCategories={hasCategories}
          handleSelectSong={handleSelectSong}
          setSelectedSong={setSelectedSong}
          setShowCategoryLine={setShowCategoryLine}
        />
      );
    },
    [searchResults, bottomInset, handleSelectSong, tabSelectedCategoryIds, q]
  );

  if (isLoadingSearchResults) {
    return <LoadingView />;
  }

  if (isErrorSearchResults) {
    return (
      <InfoView
        title={t('common.somethingWentWrong')}
        message={t('search.errorMessage')}
        icon='image-broken-variant'
        onActionPress={refetchSearchResults}
        actionLabel={t('common.retry')}
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
              navigationState={{ index: tabIndex, routes }}
              onIndexChange={setTabIndex}
              initialLayout={{ width: layout.width }}
              renderScene={renderScene}
              renderTabBar={(props) => {
                const localTabIndex = props.navigationState.index;
                const categories =
                  searchResults[localTabIndex]?.categories || [];
                const selectedCategoryId =
                  tabSelectedCategoryIds[localTabIndex];
                return (
                  <View style={{ position: 'relative', zIndex: 1 }}>
                    <TabBar {...props} />
                    {categories.length > 0 && (
                      <Animated.View
                        style={[
                          styles.categoriesWrapper,
                          { backgroundColor: theme.colors.background },
                        ]}
                        entering={
                          Platform.OS !== 'web'
                            ? SlideInUp.duration(250).easing(
                                Easing.bezierFn(0.75, 0.1, 0.25, 1)
                              )
                            : FadeIn.duration(100)
                        }
                        exiting={
                          Platform.OS !== 'web'
                            ? SlideOutUp.duration(500).easing(
                                Easing.bezierFn(0.75, 0.1, 0.25, 1)
                              )
                            : FadeOut.duration(100)
                        }
                      >
                        {showCategoryLine && (
                          <Animated.View
                            key='category-line'
                            entering={FadeIn.duration(50)}
                            exiting={FadeOut.duration(50)}
                            style={[
                              styles.categoryLine,
                              {
                                backgroundColor: theme.colors.inverseOnSurface,
                              },
                            ]}
                          />
                        )}
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                        >
                          <View style={styles.categoriesContainer}>
                            {!!selectedCategoryId && (
                              <IconButton
                                icon='close'
                                mode='contained-tonal'
                                size={18} // arbitrary size to be in line with chips
                                onPress={() => {
                                  setShowCategoryLine(false);
                                  setTabSelectedCategoryIds((prev) => ({
                                    ...prev,
                                    [localTabIndex]: undefined,
                                  }));
                                }}
                                style={{
                                  margin: 0,
                                  backgroundColor:
                                    theme.colors.inverseOnSurface,
                                }}
                                accessibilityLabel={t('search.clear')}
                              />
                            )}
                            {categories.map((category) => (
                              <Chip
                                key={category.id}
                                onPress={() => {
                                  setShowCategoryLine(false);
                                  setTabSelectedCategoryIds((prev) => ({
                                    ...prev,
                                    [localTabIndex]: category.id,
                                  }));
                                }}
                                selected={selectedCategoryId === category.id}
                                showSelectedCheck={false}
                                style={{
                                  backgroundColor:
                                    selectedCategoryId === category.id
                                      ? theme.colors.onSurface
                                      : theme.colors.inverseOnSurface,
                                }}
                                selectedColor={
                                  selectedCategoryId === category.id
                                    ? theme.colors.surface
                                    : theme.colors.onSurface
                                }
                              >
                                {category.label}
                              </Chip>
                            ))}
                          </View>
                        </ScrollView>
                      </Animated.View>
                    )}
                  </View>
                );
              }}
            />
            {selectedSong && (
              <SearchResultMenu
                ref={searchResultMenuRef}
                song={selectedSong}
                onSongActionSelect={handleSelectSong}
                source='search'
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
