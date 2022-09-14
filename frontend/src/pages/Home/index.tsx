import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe } from '~/app/slices/user.slice';
import DatabaseContenxt from '~/context/DatabaseContext';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import Desktop from './Desktop';
import Mobile from './Mobile';
import { getFriendsList } from '~/app/slices/friends.slice';
import { getMyConversations } from '~/app/slices/conversations.slice';
import { connectSocket } from '../../providers/SocketProvider';
import { setSocket } from '~/app/slices/global.slice';
import Auth from '~/services/apis/Auth.api';
import { Button } from '@chakra-ui/react';

type Props = {};

export default function Home({}: Props) {
  const isLargerThanHD = useAppSelector(
    (state) => state.globalSlice.isLargerThanHD
  );
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/');
  }, [isLargerThanHD]);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const access_token = localStorage.getItem('access_token');
    if (!access_token) {
      navigate('/login');
    } else {
      dispatch(getMe());
      dispatch(getFriendsList());
      dispatch(getMyConversations());
      const s = connectSocket();
      dispatch(setSocket(s));
      s.on('connectSuccessFull', (data) => {
        console.log(data);
      });
    }
  }, []);
  const handle = async () => {
    const response = await Auth.refreshToken();
    console.log(response);
  };
  // return <Button onClick={handle}>hhihihi</Button>;
  return <>{isLargerThanHD ? <Desktop /> : <Mobile />}</>;
}
