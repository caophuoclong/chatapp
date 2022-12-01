import axios from 'axios';
import queryString from 'query-string';
import { SERVER_URL } from '~/configs';
import Auth from './apis/Auth.api';
import AuthApi from '~/services/apis/Auth.api';
const axiosClient = axios.create({
  baseURL: SERVER_URL + '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  paramsSerializer: (params) => queryString.stringify(params),
});
const getLocalToken: () => {
  accessToken: string | undefined;
  expiredTokenTime: number | undefined;
} = () => {
  const accessToken = window.localStorage.getItem('access_token');
  let expiredTokenTime = window.localStorage.getItem('expiredTime');
  if (!accessToken || !expiredTokenTime) {
    return {
      accessToken: undefined,
      expiredTokenTime: undefined,
    };
  } else {
    const expiredTokenTime1 = +expiredTokenTime;
    return {
      accessToken,
      expiredTokenTime: expiredTokenTime1,
    };
  }
};

export const setLocalToken = (accessToken: string, expiredTime: string) => {
  window.localStorage.setItem('access_token', accessToken);
  window.localStorage.setItem('expiredTime', expiredTime);
};
axiosClient.interceptors.request.use(
  async (config) => {
    const unSecureUrl = [
      '/login',
      '/register',
      '/auth/create_forgot_token',
      '/auth/createNewPassword',
      '/auth/refresh-token',
      '/auth/confirm',
    ];
    // const isUnSecureUrl = unSecureUrl.some((url) => config.url?.includes(url));
    // if (isUnSecureUrl) return config;
    const { accessToken, expiredTokenTime } = getLocalToken();
    if (config.headers) config.headers.Authorization = `Bearer ${accessToken}`;
    // if (!accessToken || !expiredTokenTime) {
    //   throw new Error();
    // }
    // const now = Date.now();
    // if (expiredTokenTime < now) {
    //   try {
    //     const response = await Auth.refreshToken();
    //     const { access_token, expired_time } = response.data;
    //     setLocalToken(access_token, expired_time);
    //     if (config.headers)
    // config.headers.Authorization = `Bearer ${access_token}`;
    //     return config;
    //   } catch (error) {
    //     return Promise.reject(error);
    //   }
    // } else {
    //   if (config.headers) {
    //     config.headers.Authorization = `Bearer ${accessToken}`;
    //   }
    //   return config;
    // }
    return config;
  },
  (err) => Promise.reject(err)
);
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response.status;
    switch (status) {
      case 401:
        // console.log("refresh token");
        const refreshToken = await AuthApi.refreshToken();
        if (refreshToken) {
          const { token, expired_time } = refreshToken.data;
          setLocalToken(token, expired_time);
          error.response.config.headers.Authorization = token;
          return axiosClient(error.response.config);
        }
        break;
      default:
        throw error;
    }
  }
);
export default axiosClient;
