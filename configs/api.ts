import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// TODO: Make this configurable on the settings page
const HOST = 'http://192.168.1.50:26538';
const API_VERSION = 'v1';
const API_URL = `${HOST}/api/${API_VERSION}`;

axios.defaults.baseURL = API_URL;

const authenticate = async () => {
  const { data } = await axios.post<{ accessToken: string }>(`${HOST}/auth/1`);
  await AsyncStorage.setItem('accessToken', data.accessToken);
  return data.accessToken;
};

axios.interceptors.request.use(async (config) => {
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
