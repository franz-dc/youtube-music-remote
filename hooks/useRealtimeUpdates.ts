import { useEffect } from 'react';

import useWebSocket, { ReadyState } from 'react-use-websocket-lite';

import {
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

/**
 * Re-implementation of useQuery hooks from original polled REST API GET
 * requests to use WebSocket (real-time updates) instead.
 */
export const useRealtimeUpdates = (enabled: boolean) => {
  const ipAddress = useSettingAtom('ipAddress');
  const connectionString = useConnectionString('ws');
  const url = `${connectionString}/ws`;

  // clear query cache on url change
  useEffect(() => {
    queryClient.clear();
  }, [url]);

  const ws = useWebSocket({
    url,
    connect: enabled && !!ipAddress,
    onClose: () => {
      queryClient.clear();
    },
    onError: () => {
      queryClient.clear();
      store.set(isWebsocketErrorAtom, true);
    },
    onMessage: async (event) => {
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

          // There are edge cases where there are race condition issues between
          // the new "now playing" song and queue. To mitigate this, refetch the
          // queue when the now playing song exits and the queue is empty (after
          // a short delay).
          //
          // Replicable via:
          // - Playing a "video" (not a song) from "Listen again" section
          // - Coming from a disconnected state then reconnecting
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
