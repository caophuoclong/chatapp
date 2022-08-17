import React, { useContext, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button, extendTheme, Flex, useColorMode } from '@chakra-ui/react';
import { Route, Routes } from 'react-router-dom';
import {useAppDispatch} from "@app/hooks"
import Home from "./pages/Home";
import Register from './pages/Register';
import Login from './pages/Login';
import { SocketContext } from './context/SocketProvider';

// import 'moment/locale/'

function App() {
  const {toggleColorMode, colorMode} = useColorMode();
  const brakePoints = {
    sm: '320px',
    md: '768px',
    lg: '960px',
    xl: '1200px',
    '2xl': '1536px',
  };
  const theme = extendTheme({breakpoints: brakePoints});
  (()=>{
    const device = navigator.userAgent;
  })();
  const socket = useContext(SocketContext);
  socket.on("message", (message)=>{
    console.log(message);
  })

  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/message/:id" element={<Home/>}/>
      
      <Route path="/signup" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
    </Routes>
  );
}

export default App;
