import { unwrapResult } from '@reduxjs/toolkit';
import React, { useEffect } from 'react';
import { getFriendsList } from '~/app/slices/friends.slice';
import { getMessages } from '~/app/slices/messages.slice';
import { getMe } from '~/app/slices/user.slice';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import Desktop from './Desktop';
import Mobile from './Mobile';
import ConversationsApi from '../../services/apis/Conversations.api';
import { updateEmoji } from '~/app/slices/conversations.slice';

type Props = {};

export default function Main({}: Props) {
  const myId = useAppSelector((state) => state.userSlice.info)._id;
  const messages = useAppSelector((state) => state.messageSlice.messages);
  const isLargerThanHD = useAppSelector(
    (state) => state.globalSlice.isLargerThanHD
  );
  const choosenConversation = useAppSelector(
    (state) => state.globalSlice.conversation.choosenConversationID
  );
  const conversations = useAppSelector(
    (state) => state.conversationsSlice.conversations
  );
  let conversation = conversations.find(
    (con) => con._id === choosenConversation
  );
  if (conversation && conversation.type === 'direct') {
    const x = conversation.participants.filter((item) => item._id !== myId)[0];
    conversation = {
      ...conversation,
      name: x.name,
      avatarUrl: x.avatarUrl,
    };
  }
  const dispatch = useAppDispatch();
  useEffect(() => {
    (async () => {
      if (choosenConversation && !messages[choosenConversation]) {
        try {
          const unwrap = await dispatch(
            getMessages({
              conversationId: choosenConversation,
              skip: 0,
            })
          );

          unwrapResult(unwrap);
        } catch (error) {
          console.log(error);
        }
      }
      if (choosenConversation && !conversation?.emoji) {
        try {
          const response = await ConversationsApi.getMyEmoji(
            choosenConversation
          );
          const emoji = response.data.data;
          dispatch(updateEmoji({ _id: choosenConversation, emoji }));
        } catch (error) {
          console.log(error);
        }
        console.log('Not found emoji');
      }
    })();
  }, [choosenConversation]);
  return conversation ? (
    isLargerThanHD ? (
      <Desktop choosenConversation={conversation} />
    ) : (
      <Mobile choosenConversation={conversation} />
    )
  ) : (
    <></>
  );
}
