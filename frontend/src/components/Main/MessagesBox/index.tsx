import { Box, Flex } from '@chakra-ui/react';
import moment from 'moment-timezone';
import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '~/app/hooks';
import MyMessage from './Message/MyMessage';
import OtherMessage from './Message/OtherMessage';
import { IMessage } from '../../../interfaces/IMessage';
import { getMessages } from '~/app/slices/messages.slice';
import { useAppDispatch } from '../../../app/hooks';

type Props = {};
function useScrollToBottom<T extends HTMLElement>(ref: React.RefObject<T>) {
  useEffect(() => {
    if (ref.current) {
      const element = ref.current;
      element.scrollTop = element.scrollHeight;
    }
  }, [ref]);
}

export default function MessagesBox({}: Props) {
  const choosenConversation = useAppSelector(
    (state) => state.globalSlice.conversation.choosenConversationID
  );
  const myId = useAppSelector((state) => state.userSlice.info._id);
  const messages = useAppSelector((state) => state.messageSlice.messages);
  const [messageReversed, setMessageReversed] = useState<IMessage[]>([]);
  const divRef = useRef<HTMLDivElement>(null);
  const flexRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const [shouldScroll, setShouldScroll] = useState(true);
  useEffect(() => {
    if (shouldScroll) divRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages[choosenConversation]]);
  const handleOnScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const element = flexRef.current;
    const scrollTop = element?.scrollTop || 0;
    const scrollHeight = element?.clientHeight || 0;
    const bounding = divRef.current?.getBoundingClientRect();

    if (bounding)
      if (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.right <= window.innerWidth &&
        bounding.bottom <= window.innerHeight
      ) {
        setShouldScroll(true);
      }

    if (
      scrollTop === 0 &&
      messages[choosenConversation].data.length <
        messages[choosenConversation].count
    ) {
      setShouldScroll(false);
      dispatch(
        getMessages({
          conversationId: choosenConversation,
          skip: messages[choosenConversation].data.length,
        })
      );
    }
  };
  return (
    <Flex
      onScroll={handleOnScroll}
      ref={flexRef}
      direction="column"
      // justifyContent={'flex-end'}
      // alignItems={"center"}
      boxSizing="border-box"
      width="100%"
      height={{
        lg: '90%',
      }}
      // paddingY="1rem"
      paddingX=".7rem"
      overflow={'auto'}
      gap=".5rem"
    >
      {messages[choosenConversation] &&
        [...messages[choosenConversation].data]
          .sort((a, b) => a.createdAt - b.createdAt)
          .map((message) =>
            message.sender._id === myId ? (
              <MyMessage
                key={message._id}
                message={message.content}
                time={moment(new Date(+message.createdAt)).format('HH:mm')}
              />
            ) : (
              <OtherMessage
                key={message._id}
                message={message.content}
                time={moment(new Date(+message.createdAt)).format('HH:mm')}
              />
            )
          )}

      <div ref={divRef}></div>
    </Flex>
  );
}
