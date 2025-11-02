import axios from 'axios';

import { DEFAULT_SETTINGS } from '@/constants';

import { accessTokenAtom, settingAtomFamily, store } from './storage';

export const API_VERSION = 'v1';

// explicitly set the timeout to 5s due to React Native not failing requests
axios.defaults.timeout = 5000;

const getHost = () => {
  const ipAddress =
    (store.get(settingAtomFamily('ipAddress')) as string) || '0.0.0.0';
  const port =
    (store.get(settingAtomFamily('port')) as string) || DEFAULT_SETTINGS.port;
  return `http://${ipAddress}:${port}`;
};

const authenticate = async () => {
  const host = getHost();
  const { data } = await axios.post<{ accessToken: string }>(`${host}/auth/1`);
  store.set(accessTokenAtom, data.accessToken);
  return data.accessToken;
};

axios.interceptors.request.use((config) => {
  const host = getHost();
  config.baseURL = `${host}/api/${API_VERSION}`;
  const accessToken = store.get(accessTokenAtom);
  if (accessToken) {
    config.headers['Authorization'] = accessToken;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 401 ||
        error.response?.data?.error?.issues?.[0]?.path?.[0] ===
          'authorization') &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const accessToken = await authenticate();
        originalRequest.headers['Authorization'] = accessToken;
        return axios.request(originalRequest);
      } catch (error) {
        return Promise.reject(error);
      }
    } else {
      return Promise.reject(error);
    }
  }
);

export default axios;
