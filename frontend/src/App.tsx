import React, { useContext, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button, extendTheme, Flex, useColorMode } from '@chakra-ui/react';
import { Route, Routes } from 'react-router-dom';
import { useAppDispatch } from '~/app/hooks';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import { SocketContext } from './context/SocketProvider';

// import 'moment/locale/'
import Setting from './components/Settings';
import Contacts from './components/Contacts';
import User from './components/user';
import i18n from './i18n';
import moment from 'moment';
import { registerLocale } from 'react-datepicker';
import vi from 'date-fns/locale/vi';
import es from 'date-fns/locale/es';
import { handleChangeLanguage } from './app/slices/global.slice';

function App() {
  const { toggleColorMode, colorMode } = useColorMode();
  const brakePoints = {
    sm: '320px',
    md: '768px',
    lg: '960px',
    xl: '1200px',
    '2xl': '1536px',
  };
  const theme = extendTheme({ breakpoints: brakePoints });
  (() => {
    const device = navigator.userAgent;
  })();
  const socket = useContext(SocketContext);
  socket.on('message', (message) => {
    console.log(message);
  });
  const dispatch = useAppDispatch();
  useEffect(() => {
    const lan = (window.localStorage.getItem('lan') || 'vn') as 'en' | 'vn';
    dispatch(handleChangeLanguage(lan));
    i18n.changeLanguage(lan);
    window.localStorage.setItem('lan', lan);
    moment.locale(lan === 'vn' ? 'vi' : 'es');
  }, []);

  return (
    <Routes>
      <Route path={'/'} element={<Home />} />
      <Route path="/message/:id/*" element={<Home />} />
      <Route path="/user" element={<User />} />
      <Route path="/contacts" element={<Contacts />} />

      <Route path="/signup" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
