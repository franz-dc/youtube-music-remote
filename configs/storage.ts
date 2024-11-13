import { createStore } from 'jotai';
import { useAtom } from 'jotai/react';
import { atomFamily, atomWithStorage, createJSONStorage } from 'jotai/utils';
import { MMKV } from 'react-native-mmkv';

import { DEFAULT_SETTINGS } from '@/constants';
import { SettingsSchema } from '@/schemas';

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

export const accessTokenAtom = atomWithMMKV('accessToken', '');

export const settingAtom = atomFamily((setting: keyof SettingsSchema) =>
  atomWithMMKV(setting, DEFAULT_SETTINGS[setting] as string | boolean)
);

export const useSettingAtom = (setting: keyof SettingsSchema) =>
  useAtom(settingAtom(setting));