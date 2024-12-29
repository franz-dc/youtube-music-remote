enum PageType {
  MusicPageTypeAlbum = 'MUSIC_PAGE_TYPE_ALBUM',
  MusicPageTypeArtist = 'MUSIC_PAGE_TYPE_ARTIST',
  MusicPageTypeTrackCredits = 'MUSIC_PAGE_TYPE_TRACK_CREDITS',
  MusicPageTypeUserChannel = 'MUSIC_PAGE_TYPE_USER_CHANNEL',
}

enum IconType {
  AddToPlaylist = 'ADD_TO_PLAYLIST',
  AddToRemoteQueue = 'AddToRemoteQueue',
  Album = 'ALBUM',
  Artist = 'ARTIST',
  DismissQueue = 'DISMISS_QUEUE',
  Favorite = 'FAVORITE',
  Flag = 'FLAG',
  LibraryAdd = 'LIBRARY_ADD',
  LibrarySaved = 'LIBRARY_SAVED',
  Mix = 'MIX',
  PeopleGroup = 'PEOPLE_GROUP',
  QueuePlayNext = 'QUEUE_PLAY_NEXT',
  Remove = 'REMOVE',
  Share = 'SHARE',
  Unfavorite = 'UNFAVORITE',
}

enum QueueInsertPosition {
  InsertAfterCurrentVideo = 'INSERT_AFTER_CURRENT_VIDEO',
  InsertAtEnd = 'INSERT_AT_END',
}

enum Status {
  Indifferent = 'INDIFFERENT',
  Like = 'LIKE',
}

export type PlaylistPanelVideoRenderer = {
  title: { runs: { text: string }[] };
  longBylineText: {
    runs: {
      text: string;
      navigationEndpoint?: {
        clickTrackingParams: string;
        browseEndpoint: {
          browseId: string;
          browseEndpointContextSupportedConfigs: {
            browseEndpointContextMusicConfig: {
              pageType: PageType;
            };
          };
        };
      };
    }[];
  };
  thumbnail: {
    thumbnails: {
      url: string;
      width: number;
      height: number;
    }[];
  };
  lengthText: {
    runs: { text: string }[];
    accessibility: {
      accessibilityData: {
        label: string;
      };
    };
  };
  selected: boolean;
  navigationEndpoint: {
    clickTrackingParams: string;
    watchEndpoint: {
      videoId: string;
      playlistId: string;
      index: number;
      params: string;
      playerParams: string;
      playlistSetVideoId: string;
      loggingContext: {
        vssLoggingContext: {
          serializedContextData: string;
        };
      };
      watchEndpointMusicSupportedConfigs: {
        watchEndpointMusicConfig: {
          hasPersistentPlaylistPanel: boolean;
          musicVideoType: string;
        };
      };
    };
  };
  videoId: string;
  shortBylineText: { runs: { text: string }[] };
  trackingParams: string;
  menu: {
    menuRenderer: {
      items: {
        menuNavigationItemRenderer?: {
          text: { runs: { text: string }[] };
          icon: { iconType: IconType };
          navigationEndpoint?: {
            clickTrackingParams: string;
            watchEndpoint?: {
              videoId: string;
              playlistId: string;
              params: string;
              loggingContext: {
                vssLoggingContext: {
                  serializedContextData: string;
                };
              };
              watchEndpointMusicSupportedConfigs: {
                watchEndpointMusicConfig: {
                  musicVideoType: string;
                };
              };
            };
            addToPlaylistEndpoint?: {
              videoId: string;
            };
            browseEndpoint?: {
              browseId: string;
              browseEndpointContextSupportedConfigs: {
                browseEndpointContextMusicConfig: {
                  pageType: PageType;
                };
              };
            };
            shareEntityEndpoint?: {
              serializedShareEntity: string;
              sharePanelType: string;
            };
          };
          trackingParams: string;
          serviceEndpoint?: {
            clickTrackingParams: string;
            queueAddEndpoint?: {
              queueTarget: {
                videoId: string;
                onEmptyQueue: {
                  clickTrackingParams: string;
                  watchEndpoint: {
                    videoId: string;
                  };
                };
                backingQueuePlaylistId: string;
              };
              queueInsertPosition: QueueInsertPosition;
              commands: {
                clickTrackingParams: string;
                addToToastAction: {
                  item: {
                    notificationTextRenderer: {
                      successResponseText: { runs: { text: string }[] };
                      trackingParams: string;
                    };
                  };
                };
              }[];
            };
            removeFromQueueEndpoint?: {
              videoId: string;
              commands: {
                clickTrackingParams: string;
                addToToastAction: {
                  item: {
                    notificationTextRenderer: {
                      successResponseText: { runs: { text: string }[] };
                      trackingParams: string;
                    };
                  };
                };
              }[];
              itemId: string;
            };
          };
        };
        menuServiceItemRenderer?: {
          text: { runs: { text: string }[] };
          icon: { iconType: IconType };
          trackingParams: string;
          serviceEndpoint: {
            clickTrackingParams: string;
            getReportFormEndpoint?: {
              params: string;
            };
            deletePlaylistEndpoint?: {
              playlistId: string;
              command: {
                clickTrackingParams: string;
                // eslint-disable-next-line @typescript-eslint/no-empty-object-type
                dismissQueueCommand: {};
              };
            };
          };
        };
        toggleMenuServiceItemRenderer?: {
          defaultText: { runs: { text: string }[] };
          defaultIcon: { iconType: IconType };
          defaultServiceEndpoint: {
            clickTrackingParams: string;
            feedbackEndpoint?: {
              feedbackToken: string;
            };
            likeEndpoint?: {
              status: Status;
              target: {
                videoId: string;
              };
              removeLikeParams?: string;
              actions?: {
                clickTrackingParams: string;
                musicLibraryStatusUpdateCommand: {
                  libraryStatus: string;
                  addToLibraryFeedbackToken: string;
                };
              }[];
              likeParams?: string;
            };
          };
          toggledText: { runs: { text: string }[] };
          toggledIcon: { iconType: IconType };
          toggledServiceEndpoint: {
            clickTrackingParams: string;
            feedbackEndpoint?: {
              feedbackToken: string;
            };
            likeEndpoint?: {
              status: Status;
              target: {
                videoId: string;
              };
              removeLikeParams?: string;
              likeParams?: string;
            };
          };
          trackingParams: string;
        };
      }[];
      trackingParams: string;
      accessibility: {
        accessibilityData: {
          label: string;
        };
      };
    };
  };
  playlistSetVideoId: string;
  canReorder: boolean;
  playlistEditParams: string;
  queueNavigationEndpoint: {
    clickTrackingParams: string;
    queueAddEndpoint: {
      queueTarget: {
        videoId: string;
        backingQueuePlaylistId: string;
      };
      queueInsertPosition: QueueInsertPosition;
    };
  };
};

export type PlaylistPanelVideoWrapperRenderer = {
  primaryRenderer: {
    playlistPanelVideoRenderer: PlaylistPanelVideoRenderer;
  };
  counterpart: {
    counterpartRenderer: {
      playlistPanelVideoRenderer: PlaylistPanelVideoRenderer;
    };
    segmentMap: {
      segment: {
        primaryVideoStartTimeMilliseconds: string;
        counterpartVideoStartTimeMilliseconds: string;
        durationMilliseconds: string;
      }[];
    };
  }[];
};

export type QueueSchema = {
  items: {
    playlistPanelVideoRenderer?: PlaylistPanelVideoRenderer;
    playlistPanelVideoWrapperRenderer?: PlaylistPanelVideoWrapperRenderer;
  }[];
  autoPlaying: boolean;
  continuation: string;
};
