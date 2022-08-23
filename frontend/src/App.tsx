import React, { useContext, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  Button,
  extendTheme,
  Flex,
  useColorMode,
  useMediaQuery,
} from '@chakra-ui/react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '~/app/hooks';
import Home from './pages/Home';
import Register from './pages/Register';
import { SocketContext } from './context/SocketContext';

// import 'moment/locale/'
import Setting from './components/Settings';
import Contacts from './components/Contacts/';
import User from './components/user';
import i18n from './i18n';
import moment from 'moment';
import { registerLocale } from 'react-datepicker';
import vi from 'date-fns/locale/vi';
import es from 'date-fns/locale/es';
import {
  handleChangeLanguage,
  handleSetLargerThanHD,
} from './app/slices/global.slice';
import AddFriend from './components/Contacts/Mobile/AddFriend';
import FoundUser from './components/Contacts/Mobile/AddFriend/FoundUser';
import Login from './pages/Login';
import { getMe } from './app/slices/user.slice';
import { getFriendsList } from './app/slices/friends.slice';

function App() {
  const { toggleColorMode, colorMode } = useColorMode();
  const dispatch = useAppDispatch();
  const brakePoints = {
    sm: '320px',
    md: '768px',
    lg: '960px',
    xl: '1200px',
    '2xl': '1536px',
  };
  const theme = extendTheme({ breakpoints: brakePoints });
  const socket = useContext(SocketContext);
  socket.on('message', (message) => {
    console.log(message);
  });
  useEffect(() => {
    const lan = (window.localStorage.getItem('lan') || 'vn') as 'en' | 'vn';
    dispatch(handleChangeLanguage(lan));
    i18n.changeLanguage(lan);
    window.localStorage.setItem('lan', lan);
    moment.locale(lan === 'vn' ? 'vi' : 'es');
  }, []);
  const [isLargerThanHD] = useMediaQuery('(min-width: 1024px)');
  useEffect(() => {
    dispatch(handleSetLargerThanHD(isLargerThanHD));
  }, [isLargerThanHD]);
  const navigate = useNavigate();
  useEffect(() => {
    const access_token = localStorage.getItem('access_token');
    if (!access_token) {
      navigate('/login');
    } else {
      dispatch(getMe());
      dispatch(getFriendsList());
    }
  }, []);
  return (
    <Routes>
      <Route path={'/'} element={<Home />} />
      <Route path="/message/:id/*" element={<Home />} />
      <Route path="/user" element={<User />} />
      <Route path="/contacts" element={<Contacts />} />
      <Route path="/contacts/add" element={<AddFriend />} />
      <Route path="/contacts/add/:id" element={<FoundUser />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
