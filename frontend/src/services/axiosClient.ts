import axios from 'axios';
import queryString from 'query-string';
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const axiosClient = axios.create({
  baseURL: SERVER_URL,
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

const setLocalToken = (accessToken: string, expiredTime: string) => {
  window.localStorage.setItem('access_token', accessToken);
  window.localStorage.setItem('expiredTime', expiredTime);
};
const getRefreshToken = () => {};
axiosClient.interceptors.request.use((config) => {
  const unSecureUrl = [
    '/login',
    '/register',
    '/auth/create_forgot_token',
    '/auth/createNewPassword',
  ];
  console.log(config.url);
  const isUnSecureUrl = unSecureUrl.some((url) => config.url?.includes(url));
  console.log(isUnSecureUrl);
  if (isUnSecureUrl) return config;
  else {
    const { accessToken, expiredTokenTime } = getLocalToken();
    if (!accessToken || !expiredTokenTime) {
      throw new Error();
    }
    const now = Date.now();
    if (expiredTokenTime > now) {
      if (config.headers) {
        config.headers.Authorization =
          'Bearer ' + localStorage.getItem('access_token');
        config.headers.AcceptAllowOrigin = '*';
      }
      return config;
    } else {
      // getRefreshToken();
    }
  }
});
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error);
    if (
      error.response.status === 400 &&
      error.response.data.message === 'User not found'
    ) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('expiredTime');
      window.location.href = '/login';
    } else {
      throw error;
    }
  }
);
export default axiosClient;
