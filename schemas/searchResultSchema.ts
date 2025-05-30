// Inferred type based from a small sample of YouTube Music search results.
export type SearchResultSchema = {
  responseContext: {
    serviceTrackingParams: {
      service: string;
      params: {
        key: string;
        value: string;
      }[];
    }[];
    maxAgeSeconds: number;
  };
  contents: {
    tabbedSearchResultsRenderer: {
      tabs: {
        tabRenderer: {
          title: string;
          selected?: boolean;
          content: {
            sectionListRenderer: {
              contents?: {
                musicCardShelfRenderer?: {
                  trackingParams: string;
                  thumbnail: {
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
                      trackingParams: string;
                    };
                  };
                  title: {
                    runs: {
                      text: string;
                      navigationEndpoint: {
                        clickTrackingParams: string;
                        browseEndpoint?: {
                          browseId: string;
                          browseEndpointContextSupportedConfigs: {
                            browseEndpointContextMusicConfig: {
                              pageType: string;
                            };
                          };
                        };
                        watchEndpoint?: {
                          videoId: string;
                          watchEndpointMusicSupportedConfigs: {
                            watchEndpointMusicConfig: {
                              musicVideoType: string;
                            };
                          };
                        };
                      };
                    }[];
                  };
                  subtitle: {
                    runs: {
                      text: string;
                      navigationEndpoint?: {
                        clickTrackingParams: string;
                        browseEndpoint: {
                          browseId: string;
                          browseEndpointContextSupportedConfigs: {
                            browseEndpointContextMusicConfig: {
                              pageType: string;
                            };
                          };
                        };
                      };
                    }[];
                    accessibility: {
                      accessibilityData: {
                        label: string;
                      };
                    };
                  };
                  contents?: {
                    messageRenderer?: {
                      text: {
                        runs: {
                          text: string;
                        }[];
                      };
                      trackingParams: string;
                      style: {
                        value: string;
                      };
                    };
                    musicResponsiveListItemRenderer?: {
                      trackingParams: string;
                      thumbnail: {
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
                          trackingParams: string;
                        };
                      };
                      overlay: {
                        musicItemThumbnailOverlayRenderer: {
                          background: {
                            verticalGradient: {
                              gradientLayerColors: string[];
                            };
                          };
                          content: {
                            musicPlayButtonRenderer: {
                              playNavigationEndpoint: {
                                clickTrackingParams: string;
                                watchEndpoint: {
                                  videoId: string;
                                  watchEndpointMusicSupportedConfigs: {
                                    watchEndpointMusicConfig: {
                                      musicVideoType: string;
                                    };
                                  };
                                  playerParams?: string;
                                };
                              };
                              trackingParams: string;
                              playIcon: {
                                iconType: string;
                              };
                              pauseIcon: {
                                iconType: string;
                              };
                              iconColor: number;
                              backgroundColor: number;
                              activeBackgroundColor: number;
                              loadingIndicatorColor: number;
                              playingIcon: {
                                iconType: string;
                              };
                              iconLoadingColor: number;
                              activeScaleFactor: number;
                              buttonSize: string;
                              rippleTarget: string;
                              accessibilityPlayData: {
                                accessibilityData: {
                                  label: string;
                                };
                              };
                              accessibilityPauseData: {
                                accessibilityData: {
                                  label: string;
                                };
                              };
                            };
                          };
                          contentPosition: string;
                          displayStyle: string;
                        };
                      };
                      flexColumns: {
                        musicResponsiveListItemFlexColumnRenderer: {
                          text: {
                            runs: {
                              text: string;
                              navigationEndpoint?: {
                                clickTrackingParams: string;
                                watchEndpoint?: {
                                  videoId: string;
                                  watchEndpointMusicSupportedConfigs: {
                                    watchEndpointMusicConfig: {
                                      musicVideoType: string;
                                    };
                                  };
                                  playerParams?: string;
                                };
                                browseEndpoint?: {
                                  browseId: string;
                                  browseEndpointContextSupportedConfigs: {
                                    browseEndpointContextMusicConfig: {
                                      pageType: string;
                                    };
                                  };
                                };
                              };
                            }[];
                            accessibility?: {
                              accessibilityData: {
                                label: string;
                              };
                            };
                          };
                          displayPriority: string;
                        };
                      }[];
                      menu: {
                        menuRenderer: {
                          items: {
                            menuNavigationItemRenderer?: {
                              text: {
                                runs: {
                                  text: string;
                                }[];
                              };
                              icon: {
                                iconType: string;
                              };
                              navigationEndpoint: {
                                clickTrackingParams: string;
                                shareEntityEndpoint?: {
                                  serializedShareEntity: string;
                                  sharePanelType: string;
                                };
                                addToPlaylistEndpoint?: {
                                  videoId: string;
                                };
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
                                browseEndpoint?: {
                                  browseId: string;
                                  browseEndpointContextSupportedConfigs: {
                                    browseEndpointContextMusicConfig: {
                                      pageType: string;
                                    };
                                  };
                                };
                              };
                              trackingParams: string;
                            };
                            menuServiceItemRenderer?: {
                              text: {
                                runs: {
                                  text: string;
                                }[];
                              };
                              icon: {
                                iconType: string;
                              };
                              serviceEndpoint: {
                                clickTrackingParams: string;
                                queueAddEndpoint: {
                                  queueTarget: {
                                    videoId: string;
                                    onEmptyQueue: {
                                      clickTrackingParams: string;
                                      watchEndpoint: {
                                        videoId: string;
                                      };
                                    };
                                  };
                                  queueInsertPosition: string;
                                  commands: {
                                    clickTrackingParams: string;
                                    addToToastAction: {
                                      item: {
                                        notificationTextRenderer: {
                                          successResponseText: {
                                            runs: {
                                              text: string;
                                            }[];
                                          };
                                          trackingParams: string;
                                        };
                                      };
                                    };
                                  }[];
                                };
                              };
                              trackingParams: string;
                            };
                            toggleMenuServiceItemRenderer?: {
                              defaultText: {
                                runs: {
                                  text: string;
                                }[];
                              };
                              defaultIcon: {
                                iconType: string;
                              };
                              defaultServiceEndpoint: {
                                clickTrackingParams: string;
                                feedbackEndpoint?: {
                                  feedbackToken: string;
                                };
                                likeEndpoint?: {
                                  status: string;
                                  target: {
                                    videoId: string;
                                  };
                                };
                              };
                              toggledText: {
                                runs: {
                                  text: string;
                                }[];
                              };
                              toggledIcon: {
                                iconType: string;
                              };
                              toggledServiceEndpoint: {
                                clickTrackingParams: string;
                                feedbackEndpoint?: {
                                  feedbackToken: string;
                                };
                                likeEndpoint?: {
                                  status: string;
                                  target: {
                                    videoId: string;
                                  };
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
                      text: {
                        runs: {
                          text: string;
                        }[];
                      };
                      icon: {
                        iconType: string;
                      };
                      accessibility: {
                        label: string;
                      };
                      trackingParams: string;
                      accessibilityData: {
                        accessibilityData: {
                          label: string;
                        };
                      };
                      command: {
                        clickTrackingParams: string;
                        watchEndpoint?: {
                          videoId: string;
                          params: string;
                          watchEndpointMusicSupportedConfigs: {
                            watchEndpointMusicConfig: {
                              musicVideoType: string;
                            };
                          };
                        };
                        addToPlaylistEndpoint?: {
                          videoId: string;
                        };
                      };
                    };
                  }[];
                  menu: {
                    menuRenderer: {
                      items: {
                        menuNavigationItemRenderer?: {
                          text: {
                            runs: {
                              text: string;
                            }[];
                          };
                          icon: {
                            iconType: string;
                          };
                          navigationEndpoint: {
                            clickTrackingParams: string;
                            shareEntityEndpoint?: {
                              serializedShareEntity: string;
                              sharePanelType: string;
                            };
                            addToPlaylistEndpoint?: {
                              videoId: string;
                            };
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
                          };
                          trackingParams: string;
                        };
                        menuServiceItemRenderer?: {
                          text: {
                            runs: {
                              text: string;
                            }[];
                          };
                          icon: {
                            iconType: string;
                          };
                          serviceEndpoint: {
                            clickTrackingParams: string;
                            queueAddEndpoint: {
                              queueTarget: {
                                videoId: string;
                                onEmptyQueue: {
                                  clickTrackingParams: string;
                                  watchEndpoint: {
                                    videoId: string;
                                  };
                                };
                              };
                              queueInsertPosition: string;
                              commands: {
                                clickTrackingParams: string;
                                addToToastAction: {
                                  item: {
                                    notificationTextRenderer: {
                                      successResponseText: {
                                        runs: {
                                          text: string;
                                        }[];
                                      };
                                      trackingParams: string;
                                    };
                                  };
                                };
                              }[];
                            };
                          };
                          trackingParams: string;
                        };
                        toggleMenuServiceItemRenderer?: {
                          defaultText: {
                            runs: {
                              text: string;
                            }[];
                          };
                          defaultIcon: {
                            iconType: string;
                          };
                          defaultServiceEndpoint: {
                            clickTrackingParams: string;
                            feedbackEndpoint?: {
                              feedbackToken: string;
                            };
                            likeEndpoint?: {
                              status: string;
                              target: {
                                videoId: string;
                              };
                            };
                          };
                          toggledText: {
                            runs: {
                              text: string;
                            }[];
                          };
                          toggledIcon: {
                            iconType: string;
                          };
                          toggledServiceEndpoint: {
                            clickTrackingParams: string;
                            feedbackEndpoint?: {
                              feedbackToken: string;
                            };
                            likeEndpoint?: {
                              status: string;
                              target: {
                                videoId: string;
                              };
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
                  onTap: {
                    clickTrackingParams: string;
                    watchEndpoint: {
                      videoId: string;
                      watchEndpointMusicSupportedConfigs: {
                        watchEndpointMusicConfig: {
                          musicVideoType: string;
                        };
                      };
                    };
                  };
                  header: {
                    musicCardShelfHeaderBasicRenderer: {
                      title: {
                        runs: {
                          text: string;
                        }[];
                      };
                      trackingParams: string;
                      strapline: {
                        runs: {
                          text: string;
                        }[];
                      };
                    };
                  };
                  thumbnailOverlay: {
                    musicItemThumbnailOverlayRenderer: {
                      background: {
                        verticalGradient: {
                          gradientLayerColors: string[];
                        };
                      };
                      content: {
                        musicPlayButtonRenderer: {
                          playNavigationEndpoint: {
                            clickTrackingParams: string;
                            watchEndpoint: {
                              videoId: string;
                              watchEndpointMusicSupportedConfigs: {
                                watchEndpointMusicConfig: {
                                  musicVideoType: string;
                                };
                              };
                            };
                          };
                          trackingParams: string;
                          playIcon: {
                            iconType: string;
                          };
                          pauseIcon: {
                            iconType: string;
                          };
                          iconColor: number;
                          backgroundColor: number;
                          activeBackgroundColor: number;
                          loadingIndicatorColor: number;
                          playingIcon: {
                            iconType: string;
                          };
                          iconLoadingColor: number;
                          activeScaleFactor: number;
                          buttonSize: string;
                          rippleTarget: string;
                          accessibilityPlayData: {
                            accessibilityData: {
                              label: string;
                            };
                          };
                          accessibilityPauseData: {
                            accessibilityData: {
                              label: string;
                            };
                          };
                        };
                      };
                      contentPosition: string;
                      displayStyle: string;
                    };
                  };
                };
                musicShelfRenderer?: {
                  title: {
                    runs: {
                      text: string;
                    }[];
                  };
                  contents: {
                    musicResponsiveListItemRenderer: {
                      trackingParams: string;
                      thumbnail: {
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
                          trackingParams: string;
                        };
                      };
                      flexColumns: {
                        musicResponsiveListItemFlexColumnRenderer: {
                          text: {
                            runs: {
                              text: string;
                              navigationEndpoint?: {
                                clickTrackingParams: string;
                                browseEndpoint?: {
                                  browseId: string;
                                  browseEndpointContextSupportedConfigs: {
                                    browseEndpointContextMusicConfig: {
                                      pageType: string;
                                    };
                                  };
                                };
                                watchEndpoint?: {
                                  videoId: string;
                                  playerParams?: string;
                                  watchEndpointMusicSupportedConfigs: {
                                    watchEndpointMusicConfig: {
                                      musicVideoType: string;
                                    };
                                  };
                                };
                              };
                            }[];
                            accessibility?: {
                              accessibilityData: {
                                label: string;
                              };
                            };
                          };
                          displayPriority: string;
                        };
                      }[];
                      menu: {
                        menuRenderer: {
                          items: {
                            menuNavigationItemRenderer?: {
                              text: {
                                runs: {
                                  text: string;
                                }[];
                              };
                              icon: {
                                iconType: string;
                              };
                              navigationEndpoint: {
                                clickTrackingParams: string;
                                shareEntityEndpoint?: {
                                  serializedShareEntity: string;
                                  sharePanelType: string;
                                };
                                browseEndpoint?: {
                                  browseId: string;
                                  browseEndpointContextSupportedConfigs: {
                                    browseEndpointContextMusicConfig: {
                                      pageType: string;
                                    };
                                  };
                                };
                                addToPlaylistEndpoint?: {
                                  videoId?: string;
                                  playlistId?: string;
                                };
                                watchPlaylistEndpoint?: {
                                  playlistId: string;
                                  params: string;
                                };
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
                                  playerParams?: string;
                                };
                              };
                              trackingParams: string;
                            };
                            menuServiceItemRenderer?: {
                              text: {
                                runs: {
                                  text: string;
                                }[];
                              };
                              icon: {
                                iconType: string;
                              };
                              serviceEndpoint: {
                                clickTrackingParams: string;
                                queueAddEndpoint: {
                                  queueTarget: {
                                    videoId?: string;
                                    onEmptyQueue: {
                                      clickTrackingParams: string;
                                      watchEndpoint: {
                                        videoId?: string;
                                        playlistId?: string;
                                      };
                                    };
                                    playlistId?: string;
                                  };
                                  queueInsertPosition: string;
                                  commands: {
                                    clickTrackingParams: string;
                                    addToToastAction: {
                                      item: {
                                        notificationTextRenderer: {
                                          successResponseText: {
                                            runs: {
                                              text: string;
                                            }[];
                                          };
                                          trackingParams: string;
                                        };
                                      };
                                    };
                                  }[];
                                };
                              };
                              trackingParams: string;
                            };
                            toggleMenuServiceItemRenderer?: {
                              defaultText: {
                                runs: {
                                  text: string;
                                }[];
                              };
                              defaultIcon: {
                                iconType: string;
                              };
                              defaultServiceEndpoint: {
                                clickTrackingParams: string;
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
                                feedbackEndpoint?: {
                                  feedbackToken: string;
                                  actions?: {
                                    clickTrackingParams: string;
                                    addToToastAction: {
                                      item: {
                                        notificationActionRenderer: {
                                          responseText: {
                                            runs: {
                                              text: string;
                                            }[];
                                          };
                                          trackingParams: string;
                                        };
                                      };
                                    };
                                  }[];
                                };
                                likeEndpoint?: {
                                  status: string;
                                  target: {
                                    videoId?: string;
                                    playlistId?: string;
                                  };
                                  actions?: {
                                    clickTrackingParams: string;
                                    musicLibraryStatusUpdateCommand: {
                                      libraryStatus: string;
                                      addToLibraryFeedbackToken: string;
                                    };
                                  }[];
                                };
                              };
                              toggledText: {
                                runs: {
                                  text: string;
                                }[];
                              };
                              toggledIcon: {
                                iconType: string;
                              };
                              toggledServiceEndpoint: {
                                clickTrackingParams: string;
                                playlistEditEndpoint?: {
                                  playlistId: string;
                                  actions: {
                                    action: string;
                                    removedVideoId: string;
                                  }[];
                                };
                                feedbackEndpoint?: {
                                  feedbackToken: string;
                                  actions?: {
                                    clickTrackingParams: string;
                                    addToToastAction: {
                                      item: {
                                        notificationActionRenderer: {
                                          responseText: {
                                            runs: {
                                              text: string;
                                            }[];
                                          };
                                          trackingParams: string;
                                        };
                                      };
                                    };
                                  }[];
                                };
                                likeEndpoint?: {
                                  status: string;
                                  target: {
                                    videoId?: string;
                                    playlistId?: string;
                                  };
                                };
                              };
                              trackingParams: string;
                              isToggled?: boolean;
                            };
                            menuServiceItemDownloadRenderer?: {
                              serviceEndpoint: {
                                clickTrackingParams: string;
                                offlineVideoEndpoint: {
                                  videoId: string;
                                  onAddCommand: {
                                    clickTrackingParams: string;
                                    getDownloadActionCommand: {
                                      videoId: string;
                                      params: string;
                                    };
                                  };
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
                          topLevelButtons?: {
                            likeButtonRenderer: {
                              target: {
                                videoId: string;
                              };
                              likeStatus: string;
                              trackingParams: string;
                              likesAllowed: boolean;
                              serviceEndpoints: {
                                clickTrackingParams: string;
                                likeEndpoint: {
                                  status: string;
                                  target: {
                                    videoId: string;
                                  };
                                };
                              }[];
                            };
                          }[];
                        };
                      };
                      flexColumnDisplayStyle: string;
                      navigationEndpoint?: {
                        clickTrackingParams: string;
                        browseEndpoint: {
                          browseId: string;
                          browseEndpointContextSupportedConfigs: {
                            browseEndpointContextMusicConfig: {
                              pageType: string;
                            };
                          };
                        };
                      };
                      itemHeight: string;
                      overlay?: {
                        musicItemThumbnailOverlayRenderer: {
                          background: {
                            verticalGradient: {
                              gradientLayerColors: string[];
                            };
                          };
                          content: {
                            musicPlayButtonRenderer: {
                              playNavigationEndpoint: {
                                clickTrackingParams: string;
                                watchEndpoint?: {
                                  videoId: string;
                                  params?: string;
                                  watchEndpointMusicSupportedConfigs: {
                                    watchEndpointMusicConfig: {
                                      musicVideoType: string;
                                    };
                                  };
                                  playerParams?: string;
                                };
                                watchPlaylistEndpoint?: {
                                  playlistId: string;
                                  params?: string;
                                };
                              };
                              trackingParams: string;
                              playIcon: {
                                iconType: string;
                              };
                              pauseIcon: {
                                iconType: string;
                              };
                              iconColor: number;
                              backgroundColor: number;
                              activeBackgroundColor: number;
                              loadingIndicatorColor: number;
                              playingIcon: {
                                iconType: string;
                              };
                              iconLoadingColor: number;
                              activeScaleFactor: number;
                              buttonSize: string;
                              rippleTarget: string;
                              accessibilityPlayData: {
                                accessibilityData: {
                                  label: string;
                                };
                              };
                              accessibilityPauseData: {
                                accessibilityData: {
                                  label: string;
                                };
                              };
                            };
                          };
                          contentPosition: string;
                          displayStyle: string;
                        };
                      };
                      playlistItemData?: {
                        videoId: string;
                      };
                      badges?: {
                        musicInlineBadgeRenderer: {
                          trackingParams: string;
                          icon: {
                            iconType: string;
                          };
                          accessibilityData: {
                            accessibilityData: {
                              label: string;
                            };
                          };
                        };
                      }[];
                    };
                  }[];
                  trackingParams: string;
                  bottomText: {
                    runs: {
                      text: string;
                    }[];
                  };
                  bottomEndpoint: {
                    clickTrackingParams: string;
                    searchEndpoint: {
                      query: string;
                      params: string;
                    };
                  };
                  shelfDivider: {
                    musicShelfDividerRenderer: {
                      hidden: boolean;
                    };
                  };
                };
              }[];
              trackingParams: string;
              header?: {
                chipCloudRenderer: {
                  chips: {
                    chipCloudChipRenderer: {
                      style: {
                        styleType: string;
                      };
                      text: {
                        runs: {
                          text: string;
                        }[];
                      };
                      navigationEndpoint: {
                        clickTrackingParams: string;
                        searchEndpoint: {
                          query: string;
                          params: string;
                        };
                      };
                      trackingParams: string;
                      accessibilityData: {
                        accessibilityData: {
                          label: string;
                        };
                      };
                      isSelected: boolean;
                      uniqueId: string;
                    };
                  }[];
                  collapsedRowCount: number;
                  trackingParams: string;
                  horizontalScrollable: boolean;
                };
              };
              continuations?: {
                reloadContinuationData: {
                  continuation: string;
                  clickTrackingParams: string;
                };
              }[];
            };
          };
          tabIdentifier: string;
          trackingParams: string;
          endpoint?: {
            clickTrackingParams: string;
            searchEndpoint: {
              query: string;
              params: string;
            };
          };
        };
      }[];
    };
  };
  trackingParams: string;
};
