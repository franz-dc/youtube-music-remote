import { SetStateAction, atom, createStore } from 'jotai';
import { useAtom } from 'jotai/react';
import { atomFamily, atomWithStorage, createJSONStorage } from 'jotai/utils';
import { MMKV } from 'react-native-mmkv';

import { SettingsSchema } from '@/schemas';

import { DEFAULT_SETTINGS } from '../constants/defaultSettings';

export const storage = new MMKV();

export const store = createStore();

function getItem(key: string): string | null {
  const value = storage.getString(key);
  return value ? value : null;
}

function setItem(key: string, value: string): void {
  storage.set(key, value);
}

function removeItem(key: string): void {
  storage.delete(key);
}

function clearAll(): void {
  storage.clearAll();
}

export const atomWithMMKV = <T>(key: string, initialValue: T) =>
  atomWithStorage<T>(
    key,
    initialValue,
    createJSONStorage<T>(() => ({
      getItem,
      setItem,
      removeItem,
      clearAll,
    }))
  );

export const settingAtomFamily = atomFamily((setting: keyof SettingsSchema) =>
  atomWithMMKV(
    setting,
    DEFAULT_SETTINGS[setting] as SettingsSchema[keyof SettingsSchema]
  )
);

type SetAtom<Args extends unknown[], Result> = (...args: Args) => Result;

export const useSettingAtom = <K extends keyof SettingsSchema>(setting: K) =>
  useAtom(settingAtomFamily(setting)) as unknown as [
    SettingsSchema[K],
    SetAtom<[SetStateAction<SettingsSchema[K]>], void>,
  ];

// access token
export const accessTokenAtom = atomWithMMKV('accessToken', '');

// sleep timer
export const sleepTimerAtom = atom(0); // in seconds
export const sleepTimerActiveAtom = atom(false);

// slider states (due to web slider jitteriness)
export const seekBarValueAtom = atom(0); // 0 to 1
export const volumeSliderValueAtom = atom(0); // 0 to 100

// realtime updates
export const isWebsocketConnectingAtom = atom(true);
export const isWebsocketErrorAtom = atom(false);
