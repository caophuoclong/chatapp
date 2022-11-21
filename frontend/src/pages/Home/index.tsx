import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe } from '~/app/slices/user.slice';
import DatabaseContenxt from '~/context/DatabaseContext';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import Desktop from './Desktop';
import Mobile from './Mobile';
import {
  addNewFriend,
  changeOnlineStatus,
  getFriendsList,
  updateAcceptFriend,
} from '~/app/slices/friends.slice';
import {
  addConversation,
  getMyConversations,
  updateLastestMessage,
  updateLatestUpdateConversation,
} from '~/app/slices/conversations.slice';
import { connectSocket } from '../../providers/SocketProvider';
import {
  setSocket,
  setChoosenConversationID,
  setShowScreen,
  ENUM_SCREEN,
} from '~/app/slices/global.slice';
import Auth from '~/services/apis/Auth.api';
import {
  Box,
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  useToast,
} from '@chakra-ui/react';
import {
  addMessage,
  getMessages,
  initMessage,
  recallMessage,
  updateReceivedMessage,
  updateSentMessage,
} from '~/app/slices/messages.slice';
import { string } from 'yup/lib/locale';
import { IMessage, MessageStatusType } from '~/interfaces/IMessage';
import { handleLogout } from '~/components/Settings/Logout';
import { useTranslation } from 'react-i18next';
import IConversation from '~/interfaces/IConversation';
import IFriendShip from '../../interfaces/IFriendShip';
import { IUser } from '~/interfaces/IUser';
import moment from 'moment';
import { updateConversation } from '~/app/slices/conversations.slice';
import ConversationsApi from '~/services/apis/Conversations.api';
import { unwrapResult } from '@reduxjs/toolkit';
import { AppSocket } from '~/class/AppSocket';

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
  const messages = useAppSelector((state) => state.messageSlice.messages);
  const toast = useToast();
  const { t } = useTranslation();
  useEffect(() => {
    (async () => {
      const access_token = localStorage.getItem('access_token');
      if (!access_token || access_token === 'undefined') {
        window.localStorage.clear();
        navigate('/login');
      } else {
        const wrap = await dispatch(getMe());
        const wrap1 = await dispatch(getFriendsList());
        const wrap2 = await dispatch(getMyConversations());
        const result2 = unwrapResult(wrap2) as Array<IConversation>;
        const promises = result2.map(
          async (conversation) =>
            await dispatch(
              getMessages({
                conversationId: conversation._id,
                skip: 0,
              })
            )
        );
        await Promise.all(promises);
      }
    })();
  }, []);
  useEffect(() => {
    const now = Date.now();
    const expriedTime = localStorage.getItem('expiredTime') || 0;
    // console.log(now, expriedTime);
    if (now < +expriedTime) {
      const s = AppSocket.getInstance();
      s.on('connectSuccessFull', (data) => {
        console.log(data);
      });
      s.on('newMessage', (data) => {
        const { destination, updateAt, ...message } = data;
        dispatch(
          addMessage({
            message: message,
            conversationId: destination,
          })
        );
        dispatch(
          updateLatestUpdateConversation({
            conversationId: destination,
            updateAt,
            message,
          })
        );
        s.emit('markReceiveMessage', message._id);
      });
      s.on('MY_FRIEND_ONLINE', (_id: string) => {
        dispatch(changeOnlineStatus({ _id, isOnline: true }));
      });
      s.on('MY_FRIEND_OFFLINE', (data: { _id: string; lastOnline: number }) => {
        // console.log(data);
        dispatch(
          changeOnlineStatus({
            _id: data._id,
            isOnline: false,
            lastOnline: data.lastOnline,
          })
        );
      });
      s.on('u_created_conversation', (data: IConversation) => {
        s.emit('joinRoom', data._id);
        dispatch(addConversation(data));
        dispatch(initMessage(data._id));
        dispatch(setChoosenConversationID(data._id));
        dispatch(setShowScreen(ENUM_SCREEN.CONVERSATIONS));
      });
      s.on(
        'sentMessageSuccess',
        (data: {
          tempId: string;
          conversationId: string;
          message: IMessage;
        }) => {
          const { conversationId, tempId, message } = data;
          dispatch(
            updateLastestMessage({
              message: message,
              conversationId,
            })
          );
          dispatch(
            updateSentMessage({
              conversationId,
              tempId,
              value: {
                _id: message._id,
                status: message.status,
              },
            })
          );
        }
      );
      s.on(
        'receivedMessage',
        (data: { conversationId: string; messageId: string }) => {
          const { conversationId, messageId } = data;
          dispatch(
            updateReceivedMessage({
              conversationId,
              messageId,
            })
          );
        }
      );
      s.on('createConversationSuccess', (data: IConversation) => {
        console.log(data);
        s.emit('joinRoom', data._id);
        dispatch(addConversation(data));
        dispatch(initMessage(data._id));
      });
      s.on('ErrorConnection', (data: Error) => {
        console.log(data);
        toast({
          title: t('Error'),
          description: t('Token__Expired'),
          status: 'error',
          position: isLargerThanHD ? 'top-right' : 'bottom',
          duration: 3000,
          isClosable: true,
        });
        handleLogout(navigate);
      });
      s.on(
        'messageHasBeenRecalled',
        (data: { conversationId: string; messageId: string }) => {
          const { conversationId, messageId } = data;
          dispatch(
            recallMessage({
              conversationId,
              messageId,
            })
          );
        }
      );
      interface ICreatedFriendShip extends IFriendShip {
        userAddress: IUser;
        userRequest: IUser;
      }
      s.on('createFriendShipSuccess_sender', (data: ICreatedFriendShip) => {
        dispatch(
          addNewFriend({
            _id: data._id,
            user: data.userAddress,
            statusCode: {
              code: 'p',
              name: 'Pending',
            },
            flag: 'sender',
          })
        );
      });
      s.on('createFriendShipSuccess', (data: ICreatedFriendShip) => {
        dispatch(
          addNewFriend({
            _id: data._id,
            user: data.userRequest,
            statusCode: {
              code: 'p',
              name: 'Pending',
            },
            flag: 'target',
          })
        );
      });
      s.on('onAcceptFriend', (data: ICreatedFriendShip) => {
        dispatch(updateAcceptFriend(data._id));
      });
      s.on('queryAgainConversation', async (data) => {
        const conversation = (
          await ConversationsApi.getConversationById(data.conversationId)
        ).data.data as IConversation;
        s.emit('joinRoom', conversation._id);
        dispatch(addConversation(conversation));
        dispatch(
          addMessage({
            message: data.message,
            conversationId: data.conversationId,
          })
        );
      });
    }
  }, []);
  const lan = useAppSelector((state) => state.globalSlice.lan);
  useEffect(() => {
    moment.locale(lan === 'en' ? 'en' : 'vi');
  }, [lan]);
  const friendShips = useAppSelector((state) => state.friendsSlice.friendShips);
  // useEffect(() => {
  //   dispatch(getFriendsList());
  // }, [friendShips]);
  const handle = async () => {
    const response = await Auth.refreshToken();
    console.log(response);
  };
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     dispatch(getFriendsList());
  //     dispatch(getMyConversations());
  //   }, 50000);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);
  // return <Button onClick={handle}>hihi</Button>;
  // return (
  //   <Box width="100vw" position="absolute">
  //     <Popover>
  //       <PopoverTrigger>
  //         <Button>Trigger</Button>
  //       </PopoverTrigger>
  //       <PopoverContent>
  //         <PopoverArrow />
  //         <PopoverCloseButton />
  //         <PopoverHeader>Confirmation!</PopoverHeader>
  //         <PopoverBody>
  //           Are you sure you want to have that milkshake?
  //         </PopoverBody>
  //       </PopoverContent>
  //     </Popover>
  //   </Box>
  // );
  return <>{isLargerThanHD ? <Desktop /> : <Mobile />}</>;
}
