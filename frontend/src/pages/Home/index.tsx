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
  initMessage,
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
    const access_token = localStorage.getItem('access_token');
    if (!access_token) {
      navigate('/login');
    } else {
      dispatch(getMe());
      dispatch(getFriendsList());
      dispatch(getMyConversations());
      const now = Date.now();
      const expriedTime = localStorage.getItem('expiredTime') || 0;
      console.log(now, expriedTime);
      if (now < +expriedTime) {
        const s = connectSocket();
        dispatch(setSocket(s));
        s.on('connectSuccessFull', (data) => {
          console.log(data);
        });
        s.on('newMessage', (data) => {
          const { destination, ...message } = data;
          dispatch(
            addMessage({
              message: message,
              conversationId: destination,
            })
          );
          dispatch(
            updateLastestMessage({
              message: message,
              conversationId: destination,
            })
          );
          s.emit('markReceiveMessage', message._id);
        });
        s.on('MY_FRIEND_ONLINE', (_id: string) => {
          dispatch(changeOnlineStatus({ _id, isOnline: true }));
        });
        s.on(
          'MY_FRIEND_OFFLINE',
          (data: { _id: string; lastOnline: number }) => {
            // console.log(data);
            dispatch(
              changeOnlineStatus({
                _id: data._id,
                isOnline: false,
                lastOnline: data.lastOnline,
              })
            );
          }
        );
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
                  status: MessageStatusType.SENT,
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
          s.emit('joinRoom', data._id);
          dispatch(addConversation(data));
          dispatch(initMessage(data._id));
        });
        s.on('ErrorConnection', (data: Error) => {
          toast({
            title: t('Error'),
            description: t('Token__Expired'),
            status: 'error',
            position: isLargerThanHD ? 'top-right' : 'bottom',
            duration: 3000,
            isClosable: true,
          });
          handleLogout(null, navigate);
        });
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
      }
    }
  }, []);
  const handle = async () => {
    const response = await Auth.refreshToken();
    console.log(response);
  };
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
