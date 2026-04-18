import { useCallback, useEffect, useState } from 'react';

import { useAtomValue } from 'jotai';
import { Platform } from 'react-native';
import useWebSocket, { ReadyState } from 'react-use-websocket-lite';

import {
  accessTokenAtom,
  isWebsocketConnectingAtom,
  isWebsocketErrorAtom,
  queryClient,
  seekBarValueAtom,
  store,
  useSettingAtom,
  volumeSliderValueAtom,
} from '@/configs';
import { WebsocketDataSchema, WebsocketDataTypes } from '@/schemas';
import { getQueue } from '@/services';
import { getSeekBarValue } from '@/utils/getSeekBarValue';

import { useConnectionString } from './useConnectionString';

const WEBSOCKET_RECONNECT_INTERVAL_MS = 5000;
const QUEUE_REFETCH_DELAY_MS = 500;

const getAuthorizationHeader = (accessToken: string) =>
  accessToken.startsWith('Bearer ') ? accessToken : `Bearer ${accessToken}`;

/**
 * Re-implementation of useQuery hooks from original polled REST API GET
 * requests to use WebSocket (real-time updates) instead.
 */
export const useRealtimeUpdates = (enabled: boolean) => {
  const [ipAddress] = useSettingAtom('ipAddress');
  const accessToken = useAtomValue(accessTokenAtom);
  const connectionString = useConnectionString('ws');
  const url = `${connectionString}/ws`;
  const shouldConnect = enabled && !!ipAddress;
  const [nativeReadyState, setNativeReadyState] = useState<ReadyState>(
    ReadyState.UNINSTANTIATED
  );

  const handleMessage = useCallback(async (messageData: string) => {
    const message: WebsocketDataSchema = JSON.parse(messageData);
    switch (message.type) {
      case WebsocketDataTypes.PlayerInfo: {
        queryClient.setQueryData(['nowPlaying'], () => message.song || null);
        queryClient.setQueryData(
          ['nowPlayingElapsedSeconds'],
          () => message.position
        );
        queryClient.setQueryData(['isPlaying'], () => message.isPlaying);
        queryClient.setQueryData(['isMuted'], () => message.muted);
        queryClient.setQueryData(['volume'], () => message.volume);
        queryClient.setQueryData(['repeatMode'], () => message.repeat);
        queryClient.setQueryData(['isShuffle'], () => message.shuffle);
        store.set(seekBarValueAtom, getSeekBarValue());
        store.set(volumeSliderValueAtom, message.volume);

        break;
      }
      case WebsocketDataTypes.VideoChanged: {
        queryClient.setQueryData(['nowPlaying'], () => message.song);
        queryClient.setQueryData(
          ['nowPlayingElapsedSeconds'],
          () => message.position
        );
        queryClient.setQueryData(['isPlaying'], () => !message.song?.isPaused);
        store.set(seekBarValueAtom, getSeekBarValue());

        const data = await getQueue();

        if (data?.items.length) {
          queryClient.setQueryData(['queue'], () => data);
        } else {
          setTimeout(() => {
            queryClient.refetchQueries({ queryKey: ['queue'] });
          }, QUEUE_REFETCH_DELAY_MS);
        }

        break;
      }
      case WebsocketDataTypes.PlayerStateChanged: {
        queryClient.setQueryData(['isPlaying'], () => message.isPlaying);
        queryClient.setQueryData(
          ['nowPlayingElapsedSeconds'],
          () => message.position
        );
        store.set(seekBarValueAtom, getSeekBarValue());
        break;
      }
      case WebsocketDataTypes.PositionChanged: {
        queryClient.setQueryData(
          ['nowPlayingElapsedSeconds'],
          () => message.position
        );
        store.set(seekBarValueAtom, getSeekBarValue());
        break;
      }
      case WebsocketDataTypes.VolumeChanged: {
        queryClient.setQueryData(['volume'], () => message.volume);
        queryClient.setQueryData(['isMuted'], () => message.muted);
        store.set(volumeSliderValueAtom, message.volume);
        break;
      }
      case WebsocketDataTypes.RepeatChanged: {
        queryClient.setQueryData(['repeatMode'], () => message.repeat);
        break;
      }
      case WebsocketDataTypes.ShuffleChanged: {
        queryClient.setQueryData(['isShuffle'], () => message.shuffle);
        break;
      }
    }
  }, []);

  // clear query cache on url change
  useEffect(() => {
    queryClient.clear();
  }, [url]);

  const ws = useWebSocket({
    url,
    connect: Platform.OS === 'web' && shouldConnect,
    onClose: () => {},
    onError: (e: any) => {
      if (e?.message === 'Software caused connection abort') {
        // due to app going to background on mobile devices
        store.set(isWebsocketConnectingAtom, true);
        queryClient.refetchQueries({ queryKey: ['queue'] });
      } else {
        store.set(isWebsocketErrorAtom, true);
      }
    },
    onMessage: async (event) => handleMessage(event.data),
    shouldReconnect: true,
    reconnectInterval: WEBSOCKET_RECONNECT_INTERVAL_MS,
  });

  useEffect(() => {
    if (Platform.OS === 'web') return;
    if (!shouldConnect) return;

    let websocket: WebSocket | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
    let isActive = true;

    const connect = () => {
      if (!isActive) return;

      setNativeReadyState(ReadyState.CONNECTING);

      const options = accessToken
        ? ({
            headers: {
              Authorization: getAuthorizationHeader(accessToken),
            },
          } as any)
        : undefined;

      websocket = new WebSocket(url, undefined, options);

      websocket.onopen = () => {
        if (!isActive) return;
        setNativeReadyState(ReadyState.OPEN);
      };

      websocket.onmessage = (event) => {
        void handleMessage(String(event.data));
      };

      websocket.onerror = () => {
        if (!isActive) return;
        store.set(isWebsocketErrorAtom, true);
      };

      websocket.onclose = () => {
        if (!isActive) return;
        setNativeReadyState(ReadyState.CLOSED);
        reconnectTimeout = setTimeout(connect, WEBSOCKET_RECONNECT_INTERVAL_MS);
      };
    };

    connect();

    return () => {
      isActive = false;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (websocket) websocket.close();
    };
  }, [accessToken, handleMessage, shouldConnect, url]);

  const readyState =
    Platform.OS === 'web'
      ? ws.readyState
      : shouldConnect
        ? nativeReadyState
        : ReadyState.UNINSTANTIATED;

  useEffect(() => {
    switch (readyState) {
      case ReadyState.CONNECTING:
        store.set(isWebsocketConnectingAtom, true);
        break;
      case ReadyState.OPEN:
        store.set(isWebsocketConnectingAtom, false);
        store.set(isWebsocketErrorAtom, false);
        break;
      case ReadyState.CLOSING:
        store.set(isWebsocketConnectingAtom, true);
        store.set(isWebsocketErrorAtom, false);
        break;
      case ReadyState.CLOSED:
        store.set(isWebsocketConnectingAtom, false);
        store.set(isWebsocketErrorAtom, true);
        break;
      default:
        break;
    }
  }, [readyState]);

  return Platform.OS === 'web'
    ? ws
    : {
        sendMessage: () => {},
        readyState,
        getWebSocket: () => null,
      };
};
