export enum RepeatMode {
  NONE = 'NONE',
  ALL = 'ALL',
  ONE = 'ONE',
}

export type RepeatModeStateSchema = {
  mode: RepeatMode | null;
};
