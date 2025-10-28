import { useEffect, useState } from 'react';

import { useAtomValue } from 'jotai';
import useWebSocket, { ReadyState } from 'react-use-websocket-lite';

import {
  API_VERSION,
  isWebsocketConnectingAtom,
  isWebsocketErrorAtom,
  queryClient,
  seekBarValueAtom,
  settingAtomFamily,
  store,
  volumeSliderValueAtom,
} from '@/configs';
import { DEFAULT_SETTINGS } from '@/constants';
import { WebsocketDataSchema, WebsocketDataTypes } from '@/schemas';
import { getSeekBarValue } from '@/utils/getSeekBarValue';

const WEBSOCKET_RECONNECT_INTERVAL_MS = 5000;
const QUEUE_REFETCH_DELAY_ON_RECONNECT_MS = 1000;

/**
 * Re-implementation of useQuery hooks from original polled REST API GET
 * requests to use WebSocket (real-time updates) instead.
 */
export const useRealtimeUpdates = (enabled: boolean) => {
  const [didDisconnect, setDidDisconnect] = useState(false);

  const ipAddress = useAtomValue(settingAtomFamily('ipAddress')) as string;
  const port = useAtomValue(settingAtomFamily('port')) as string;

  const url = `ws://${ipAddress || '0.0.0.0'}:${port || DEFAULT_SETTINGS.port}/api/${API_VERSION}/ws`;

  // clear query cache on url change
  useEffect(() => {
    queryClient.clear();
  }, [url]);

  const ws = useWebSocket({
    url,
    connect: enabled && !!ipAddress,
    onClose: () => {
      queryClient.clear();
      setDidDisconnect(true);
    },
    onError: () => {
      queryClient.clear();
      setDidDisconnect(true);
      store.set(isWebsocketErrorAtom, true);
    },
    onMessage: (event) => {
      const message: WebsocketDataSchema = JSON.parse(event.data);
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
          queryClient.setQueryData(
            ['isPlaying'],
            () => !message.song?.isPaused
          );
          store.set(seekBarValueAtom, getSeekBarValue());

          // On web, the queue update is not received after reconnecting,
          // so add a small delay before refetching
          if (didDisconnect) {
            setTimeout(() => {
              queryClient.refetchQueries({ queryKey: ['queue'] }).then(() => {
                setDidDisconnect(false);
              });
            }, QUEUE_REFETCH_DELAY_ON_RECONNECT_MS);
          } else {
            queryClient.refetchQueries({ queryKey: ['queue'] });
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
    },
    shouldReconnect: true,
    reconnectInterval: WEBSOCKET_RECONNECT_INTERVAL_MS,
  });

  useEffect(() => {
    switch (ws.readyState) {
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
  }, [ws.readyState]);

  return ws;
};
