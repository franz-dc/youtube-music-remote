import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { DEFAULT_SETTINGS } from '@/constants';

const API_VERSION = 'v1';

// explicitly set the timeout to 5s due to React Native not failing requests
axios.defaults.timeout = 5000;

const getHost = async () => {
  const ipAddress = (await AsyncStorage.getItem('ipAddress')) || '0.0.0.0';
  const port = (await AsyncStorage.getItem('port')) || DEFAULT_SETTINGS.port;
  return `http://${ipAddress}:${port}/api/${API_VERSION}`;
};

const authenticate = async () => {
  const host = await getHost();
  const { data } = await axios.post<{ accessToken: string }>(`${host}/auth/1`);
  await AsyncStorage.setItem('accessToken', data.accessToken);
  return data.accessToken;
};

axios.interceptors.request.use(async (config) => {
  const host = await getHost();
  config.baseURL = host;
  const accessToken = await AsyncStorage.getItem('accessToken');
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
