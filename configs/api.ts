import axios from 'axios';

import { DEFAULT_SETTINGS } from '../constants/defaultSettings';
import { getAuthorizationHeader, getConnectionOrigin } from '../utils';

import {
  accessTokenAtom,
  getClientId,
  settingAtomFamily,
  store,
} from './storage';

export const API_VERSION = 'v1';
const REQUEST_TIMEOUT_MS = 5000;
const AUTHENTICATION_TIMEOUT_MS = 35000;

// explicitly set the timeout to 5s due to React Native not failing requests
axios.defaults.timeout = REQUEST_TIMEOUT_MS;
const authClient = axios.create({
  timeout: AUTHENTICATION_TIMEOUT_MS,
});
let authenticationPromise: Promise<string> | null = null;

const getHost = () => {
  const ipAddress =
    (store.get(settingAtomFamily('ipAddress')) as string) || '0.0.0.0';
  const port =
    (store.get(settingAtomFamily('port')) as string) || DEFAULT_SETTINGS.port;
  return getConnectionOrigin({
    host: ipAddress,
    port,
    protocolFamily: 'http',
  });
};

const authenticate = async () => {
  if (authenticationPromise) return authenticationPromise;

  authenticationPromise = (async () => {
    const host = getHost();
    const clientId = getClientId();
    const { data } = await authClient.post<{ accessToken: string }>(
      `${host}/auth/${clientId}`
    );
    store.set(accessTokenAtom, data.accessToken);
    return data.accessToken;
  })();

  try {
    return await authenticationPromise;
  } finally {
    authenticationPromise = null;
  }
};

axios.interceptors.request.use((config) => {
  const host = getHost();
  config.baseURL = `${host}/api/${API_VERSION}`;
  const accessToken = store.get(accessTokenAtom);
  if (accessToken) {
    config.headers['Authorization'] = getAuthorizationHeader(accessToken);
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
        originalRequest.headers['Authorization'] =
          getAuthorizationHeader(accessToken);
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
