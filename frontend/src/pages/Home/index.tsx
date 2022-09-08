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

type Props = {};

export default function Home({}: Props) {
  const socket = useAppSelector((state) => state.globalSlice.socket);
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
      if (!socket?.id) {
        dispatch(setSocket(connectSocket()));
      }
    }
  }, []);

  return <>{isLargerThanHD ? <Desktop /> : <Mobile />}</>;
}
