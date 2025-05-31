// Inferred type based from a small sample of YouTube Music search results.
// Some properties have been omitted (tracking, etc.).

// Extracted common types
type TextRun = {
  text: string;
  navigationEndpoint?: NavigationEndpoint;
};

type Runs = {
  runs: TextRun[];
};

type Icon = {
  iconType: string;
};

type WatchEndpoint = {
  videoId: string;
  playerParams?: string;
  watchEndpointMusicSupportedConfigs: {
    watchEndpointMusicConfig: {
      musicVideoType: string;
    };
  };
  playlistId?: string;
  params?: string;
  loggingContext?: {
    vssLoggingContext: {
      serializedContextData: string;
    };
  };
};

type BrowseEndpoint = {
  browseId: string;
  browseEndpointContextSupportedConfigs: {
    browseEndpointContextMusicConfig: {
      pageType: string;
    };
  };
};

type SearchEndpoint = {
  query: string;
  params: string;
};

type NavigationEndpoint = {
  browseEndpoint?: BrowseEndpoint;
  watchEndpoint?: WatchEndpoint;
  addToPlaylistEndpoint?: {
    videoId?: string;
    playlistId?: string;
  };
  shareEntityEndpoint?: {
    serializedShareEntity: string;
    sharePanelType: string;
  };
  watchPlaylistEndpoint?: {
    playlistId: string;
    params: string;
  };
  searchEndpoint?: SearchEndpoint;
};

type AccessibilityData = {
  accessibilityData: {
    label: string;
  };
};

type MenuNavigationItemRenderer = {
  text: Runs;
  icon: Icon;
  navigationEndpoint: NavigationEndpoint;
};

type MenuServiceItemRenderer = {
  text: Runs;
  icon: Icon;
  serviceEndpoint: {
    queueAddEndpoint?: {
      queueTarget: {
        videoId?: string;
        playlistId?: string;
        onEmptyQueue: {
          watchEndpoint: WatchEndpoint;
        };
      };
      queueInsertPosition: string;
      commands: {
        addToToastAction: {
          item: {
            notificationTextRenderer: {
              successResponseText: Runs;
            };
          };
        };
      }[];
    };
    offlineVideoEndpoint?: {
      videoId: string;
      onAddCommand: {
        getDownloadActionCommand: {
          videoId: string;
          params: string;
        };
      };
    };
  };
};

type ToggleMenuServiceItemRenderer = {
  defaultText: Runs;
  defaultIcon: Icon;
  defaultServiceEndpoint: {
    feedbackEndpoint?: { feedbackToken: string };
    likeEndpoint?: {
      status: string;
      target: { videoId?: string; playlistId?: string };
      actions?: {
        musicLibraryStatusUpdateCommand: {
          libraryStatus: string;
          addToLibraryFeedbackToken: string;
        };
      }[];
    };
    playlistEditEndpoint?: {
      playlistId: string;
      actions: {
        addedVideoId: string;
        action: string;
        dedupeOption: string;
        addedVideoPositionIfManualSort: number;
      }[];
      params: string;
    };
  };
  toggledText: Runs;
  toggledIcon: Icon;
  toggledServiceEndpoint: {
    feedbackEndpoint?: { feedbackToken: string; actions?: any[] };
    likeEndpoint?: {
      status: string;
      target: { videoId?: string; playlistId?: string };
      actions?: any[];
    };
    playlistEditEndpoint?: {
      playlistId: string;
      actions: { action: string; removedVideoId: string }[];
    };
  };
  isToggled?: boolean;
};

type MenuServiceItemDownloadRenderer = {
  serviceEndpoint: {
    offlineVideoEndpoint: {
      videoId: string;
      onAddCommand: {
        getDownloadActionCommand: {
          videoId: string;
          params: string;
        };
      };
    };
  };
};

type LikeButtonRenderer = {
  target: { videoId: string };
  likeStatus: string;
  likesAllowed: boolean;
  serviceEndpoints: {
    likeEndpoint: {
      status: string;
      target: { videoId: string };
    };
  }[];
};

type MenuRenderer = {
  items: (
    | { menuNavigationItemRenderer?: MenuNavigationItemRenderer }
    | { menuServiceItemRenderer?: MenuServiceItemRenderer }
    | { toggleMenuServiceItemRenderer?: ToggleMenuServiceItemRenderer }
    | { menuServiceItemDownloadRenderer?: MenuServiceItemDownloadRenderer }
  )[];
  accessibility: AccessibilityData;
  topLevelButtons?: { likeButtonRenderer: LikeButtonRenderer }[];
};

type Menu = {
  menuRenderer: MenuRenderer;
};

// Extracted overlay types
type MusicPlayButtonRenderer = {
  playNavigationEndpoint: {
    watchEndpoint?: WatchEndpoint;
    watchPlaylistEndpoint?: {
      playlistId: string;
      params?: string;
    };
  };
  playIcon: Icon;
  pauseIcon: Icon;
  iconColor: number;
  backgroundColor: number;
  activeBackgroundColor: number;
  loadingIndicatorColor: number;
  playingIcon: Icon;
  iconLoadingColor: number;
  activeScaleFactor: number;
  buttonSize: string;
  rippleTarget: string;
  accessibilityPlayData: AccessibilityData;
  accessibilityPauseData: AccessibilityData;
};

type MusicItemThumbnailOverlayRenderer = {
  background: {
    verticalGradient: {
      gradientLayerColors: string[];
    };
  };
  content: {
    musicPlayButtonRenderer: MusicPlayButtonRenderer;
  };
  contentPosition: string;
  displayStyle: string;
};

type Overlay = {
  musicItemThumbnailOverlayRenderer: MusicItemThumbnailOverlayRenderer;
};

type Thumbnail = {
  musicThumbnailRenderer: {
    thumbnail: {
      thumbnails: {
        url: string;
        width: number;
        height: number;
      }[];
    };
    thumbnailCrop: string;
    thumbnailScale: string;
  };
};

type FlexColumn = {
  musicResponsiveListItemFlexColumnRenderer: {
    text: Runs & { accessibility?: AccessibilityData };
    displayPriority: string;
  };
};

// Main schema
export type SearchResultSchema = {
  contents?: {
    tabbedSearchResultsRenderer: {
      tabs: {
        tabRenderer: {
          title: string;
          selected?: boolean;
          content: {
            sectionListRenderer: {
              contents?: {
                musicCardShelfRenderer?: {
                  thumbnail: Thumbnail;
                  title: Runs;
                  subtitle: Runs & { accessibility: AccessibilityData };
                  contents?: {
                    messageRenderer?: {
                      text: Runs;
                      style: {
                        value: string;
                      };
                    };
                    musicResponsiveListItemRenderer?: {
                      thumbnail: Thumbnail;
                      overlay: Overlay;
                      flexColumns: FlexColumn[];
                      menu: Menu;
                      playlistItemData: {
                        videoId: string;
                      };
                      flexColumnDisplayStyle: string;
                      itemHeight: string;
                    };
                  }[];
                  buttons: {
                    buttonRenderer: {
                      style: string;
                      size?: string;
                      isDisabled?: boolean;
                      text: Runs;
                      icon: Icon;
                      accessibility: {
                        label: string;
                      };
                      accessibilityData: AccessibilityData;
                      command: {
                        watchEndpoint?: WatchEndpoint;
                        addToPlaylistEndpoint?: {
                          videoId: string;
                        };
                      };
                    };
                  }[];
                  menu: Menu;
                  onTap: {
                    watchEndpoint: WatchEndpoint;
                  };
                  header: {
                    musicCardShelfHeaderBasicRenderer: {
                      title: Runs;
                      strapline: Runs;
                    };
                  };
                  thumbnailOverlay: Overlay;
                };
                musicShelfRenderer?: {
                  title: Runs;
                  contents: {
                    musicResponsiveListItemRenderer: {
                      thumbnail: Thumbnail;
                      flexColumns: FlexColumn[];
                      menu: Menu;
                      flexColumnDisplayStyle: string;
                      navigationEndpoint?: NavigationEndpoint;
                      itemHeight: string;
                      overlay?: Overlay;
                      playlistItemData?: {
                        videoId: string;
                      };
                      badges?: {
                        musicInlineBadgeRenderer: {
                          icon: Icon;
                          accessibilityData: AccessibilityData;
                        };
                      }[];
                    };
                  }[];
                  bottomText?: Runs;
                  bottomEndpoint?: {
                    searchEndpoint: SearchEndpoint;
                  };
                  continuations?: {
                    nextContinuationData: {
                      continuation: string;
                    };
                  }[];
                  shelfDivider: {
                    musicShelfDividerRenderer: {
                      hidden: boolean;
                    };
                  };
                };
              }[];
              header?: {
                chipCloudRenderer: {
                  chips: {
                    chipCloudChipRenderer: {
                      style: {
                        styleType: string;
                      };
                      text: Runs;
                      navigationEndpoint: {
                        searchEndpoint: SearchEndpoint;
                      };
                      accessibilityData: AccessibilityData;
                      isSelected: boolean;
                      uniqueId: string;
                    };
                  }[];
                  collapsedRowCount: number;
                  horizontalScrollable: boolean;
                };
              };
            };
          };
          tabIdentifier: string;
          endpoint?: {
            searchEndpoint: SearchEndpoint;
          };
        };
      }[];
    };
  };
  continuationContents?: {
    musicShelfContinuation: {
      contents: {
        musicResponsiveListItemRenderer: {
          thumbnail: Thumbnail;
          overlay: Overlay;
          flexColumns: FlexColumn[];
          menu: Menu;
          playlistItemData: {
            videoId: string;
          };
          flexColumnDisplayStyle: string;
          itemHeight: string;
          badges?: {
            musicInlineBadgeRenderer: {
              icon: Icon;
              accessibilityData: AccessibilityData;
            };
          }[];
          navigationEndpoint?: NavigationEndpoint;
        };
      }[];
      continuations: {
        nextContinuationData: {
          continuation: string;
        };
      }[];
      shelfDivider: {
        musicShelfDividerRenderer: {
          hidden: boolean;
        };
      };
      autoReloadWhenEmpty: boolean;
    };
  };
};
