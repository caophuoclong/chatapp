import React from 'react';
import { useAppSelector } from '../../app/hooks';
import Desktop from './Desktop';
import Mobile from './Mobile';

type Props = {};

export default function Main({}: Props) {
  const myId = useAppSelector((state) => state.userSlice.info)._id;
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
