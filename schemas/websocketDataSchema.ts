import { RepeatMode } from './repeatModeSchema';
import { SongInfoSchema } from './songInfoSchema';

export enum WebsocketDataTypes {
  PlayerInfo = 'PLAYER_INFO',
  VideoChanged = 'VIDEO_CHANGED',
  PlayerStateChanged = 'PLAYER_STATE_CHANGED',
  PositionChanged = 'POSITION_CHANGED',
  VolumeChanged = 'VOLUME_CHANGED',
  RepeatChanged = 'REPEAT_CHANGED',
  ShuffleChanged = 'SHUFFLE_CHANGED',
}

export type WebsocketDataSchema =
  | {
      type: WebsocketDataTypes.PlayerInfo;
      song?: SongInfoSchema;
      isPlaying: boolean;
      muted: boolean;
      position: number;
      volume: number;
      repeat: RepeatMode;
      shuffle: boolean;
    }
  | {
      type: WebsocketDataTypes.VideoChanged;
      song: SongInfoSchema;
      position: number;
    }
  | {
      type: WebsocketDataTypes.PlayerStateChanged;
      isPlaying: boolean;
      position: number;
    }
  | {
      type: WebsocketDataTypes.PositionChanged;
      position: number;
    }
  | {
      type: WebsocketDataTypes.VolumeChanged;
      volume: number;
      muted: boolean;
    }
  | {
      type: WebsocketDataTypes.RepeatChanged;
      repeat: RepeatMode;
    }
  | {
      type: WebsocketDataTypes.ShuffleChanged;
      shuffle: boolean;
    };
