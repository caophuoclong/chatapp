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
import { IMessage } from '~/interfaces/IMessage';
import { useTranslation } from 'react-i18next';
import IConversation from '~/interfaces/IConversation';
import IFriendShip from '../../interfaces/IFriendShip';
import { IUser } from '~/interfaces/IUser';
import moment from 'moment';
import ConversationsApi from '~/services/apis/Conversations.api';
import { unwrapResult } from '@reduxjs/toolkit';
import { connectSocket } from '~/utils/connectSocket';
import AuthApi from '~/services/apis/Auth.api';
import { setLocalToken } from '../../services/axiosClient';
import { SocketEvent } from '~/constants/socketEvent';
import { MarkReceiveMessage } from '../../interfaces/SocketDTO';
import MessagesApi from '~/services/apis/Messages.api';
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
  const toast = useToast();
  const { t } = useTranslation();
  const socket = useAppSelector((state) => state.globalSlice.socket);
  const state = useAppSelector((state) => state);
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
        const token = (await AuthApi.getSocketToken()).data;
        const socket = connectSocket(token);
        socket.emit(SocketEvent.AUTHENTICATE);
        dispatch(setSocket(socket));
      }
    })();
  }, []);
  const conversations = useAppSelector(
    (state) => state.conversationsSlice.conversations
  );
  useEffect(() => {
    if (socket) {
      socket.on(SocketEvent.NEW_MESSAGE, async (data: IMessage) => {
        const { destination, createdAt } = data;
        dispatch(
          addMessage({
            message: data,
            conversationId: destination,
          })
        );
        // check if exist conversation
        const conversation = conversations.find(
          (conversation) => conversation._id === destination
        );
        if (conversation) {
          dispatch(
            updateLatestUpdateConversation({
              conversationId: destination,
              updateAt: +(createdAt || 0),
              message: data,
            })
          );
        } else {
          const conversation = await ConversationsApi.getAgainConversation(
            destination
          );
          dispatch(addConversation(conversation.data));
        }
        await MessagesApi.markReceivedMessage({
          ...data,
          destination: {
            _id: data.destination,
          },
        });
      });
    }
    return () => {
      socket?.off(SocketEvent.NEW_MESSAGE);
    };
  }, [socket, state.conversationsSlice.conversations]);
  useEffect(() => {
    if (socket) {
      socket.on(
        SocketEvent.MARK_RECEIVED_MESSAGE,
        (data: MarkReceiveMessage) => {
          const { conversationId, messagesId } = data;
          messagesId.forEach((messageId) => {
            dispatch(updateReceivedMessage({ conversationId, messageId }));
          });
        }
      );
      socket.on(SocketEvent.ONLINE, (_id: string) => {
        console.log(_id);
        dispatch(changeOnlineStatus({ _id, isOnline: true }));
      });
      socket.on(
        SocketEvent.OFFLINE,
        (data: { _id: string; lastOnline: number }) => {
          console.log(data);
          dispatch(
            changeOnlineStatus({
              _id: data._id,
              isOnline: false,
              lastOnline: data.lastOnline,
            })
          );
        }
      );
      socket.on('u_created_conversation', (data: IConversation) => {
        socket.emit(SocketEvent.JOIN_CONVERSATION, data._id);
        dispatch(addConversation(data));
        dispatch(initMessage(data._id));
        dispatch(setChoosenConversationID(data._id));
        dispatch(setShowScreen(ENUM_SCREEN.CONVERSATIONS));
      });
      // socket.on(
      //   'sentMessageSuccess',
      //   (data: {
      //     tempId: string;
      //     conversationId: string;
      //     message: IMessage;
      //   }) => {
      //     const { conversationId, tempId, message } = data;
      //     dispatch(
      //       updateLastestMessage({
      //         message: message,
      //         conversationId,
      //       })
      //     );
      //     dispatch(
      //       updateSentMessage({
      //         conversationId,
      //         tempId,
      //         value: {
      //           _id: message._id,
      //           status: message.status,
      //         },
      //       })
      //     );
      //   }
      // );
      // socket.on(
      //   'receivedMessage',
      //   (data: { conversationId: string; messageId: string }) => {
      //     const { conversationId, messageId } = data;
      //     dispatch(
      //       updateReceivedMessage({
      //         conversationId,
      //         messageId,
      //       })
      //     );
      //   }
      // );
      socket.on('createConversationSuccess', (data: IConversation) => {
        socket.emit(SocketEvent.JOIN_CONVERSATION, data._id);
        dispatch(addConversation(data));
        dispatch(initMessage(data._id));
      });
      socket.on('ErrorConnection', (data: Error) => {
        toast({
          title: t('Error'),
          description: t('Token__Expired'),
          status: 'error',
          position: isLargerThanHD ? 'top-right' : 'bottom',
          duration: 3000,
          isClosable: true,
        });
      });
      socket.on(
        SocketEvent.RECALL_MESSAGE,
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
      socket.on(
        'createFriendShipSuccess_sender',
        (data: ICreatedFriendShip) => {
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
        }
      );
      socket.on('createFriendShipSuccess', (data: ICreatedFriendShip) => {
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
      socket.on('onAcceptFriend', (data: ICreatedFriendShip) => {
        dispatch(updateAcceptFriend(data._id));
      });
      socket.on('queryAgainConversation', async (data) => {
        const conversation = (
          await ConversationsApi.getConversationById(data.conversationId)
        ).data.data as IConversation;
        socket.emit(SocketEvent.JOIN_CONVERSATION, conversation._id);
        dispatch(addConversation(conversation));
        dispatch(
          addMessage({
            message: data.message,
            conversationId: data.conversationId,
          })
        );
      });
    }
    return () => {
      socket?.off(SocketEvent.MARK_RECEIVED_MESSAGE);
      socket?.off(SocketEvent.ONLINE);
      socket?.off(SocketEvent.OFFLINE);
      socket?.off(SocketEvent.RECALL_MESSAGE);
      socket?.off('u_created_conversation');
      socket?.off('createConversationSuccess');
      socket?.off('ErrorConnection');
      socket?.off('createFriendShipSuccess_sender');
      socket?.off('createFriendShipSuccess');
      socket?.off('onAcceptFriend');
      socket?.off('queryAgainConversation');
    };
  }, [socket]);
  const lan = useAppSelector((state) => state.globalSlice.lan);
  useEffect(() => {
    moment.locale(lan === 'en' ? 'en' : 'vi');
  }, [lan]);
  return <>{isLargerThanHD ? <Desktop /> : <Mobile />}</>;
}
