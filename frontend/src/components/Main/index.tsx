import { unwrapResult } from '@reduxjs/toolkit';
import React, { useEffect } from 'react';
import { getMessages } from '~/app/slices/messages.slice';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import Desktop from './Desktop';
import Mobile from './Mobile';

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
    const name = (conversation = {
      ...conversation,
      name: x.name,
      avatarUrl: x.avatarUrl,
    });
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
          const result = unwrapResult(unwrap);
        } catch (error) {
          console.log(error);
        }
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
