import { Box, Divider, Flex, Text, useColorMode } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '~/app/hooks';

import { IMessage, MessageType } from '../../../interfaces/IMessage';
import { getMessages } from '~/app/slices/messages.slice';
import { useAppDispatch } from '../../../app/hooks';
import { Emoji, EmojiStyle } from 'emoji-picker-react';
import parser from 'html-react-parser';
import MessageImage from './MessageImage';
import MyGroup from './Group/MyGroup';
import OtherGroup from './Group/OtherGroup';
import { dailyFromNow } from '~/utils/dailyFromNow';
import { MAX_TIME_DISTANCE } from '../../../configs/index';
const getMinCreated = (group: IMessage[]) => {
  return Math.min(...group.map((m) => +(m.createdAt || 0)));
};
type Props = {};
function useScrollToBottom<T extends HTMLElement>(ref: React.RefObject<T>) {
  useEffect(() => {
    if (ref.current) {
      const element = ref.current;
      element.scrollTop = element.scrollHeight;
    }
  }, [ref]);
}
export const renderMessage = (message: IMessage, style: EmojiStyle) => {
  switch (message.type) {
    case MessageType.EMOJI:
      return (
        <Flex justifyContent={'flex-end'}>
          <Emoji
            unified={message.content || ''}
            size={25 * (message.scale || 1)}
            emojiStyle={style}
          />
        </Flex>
      );
    default:
      return parser(message.content || '');
  }
};
export default function MessagesBox({}: Props) {
  const { colorMode } = useColorMode();
  const choosenConversation = useAppSelector(
    (state) => state.globalSlice.conversation.choosenConversationID
  );
  const myId = useAppSelector((state) => state.userSlice.info._id);
  const messages = useAppSelector((state) => state.messageSlice.messages);
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
      let length = 0;
      messages[choosenConversation].data.forEach((group) =>
        group.forEach(() => {
          length++;
        })
      );
      if (messages[choosenConversation])
        dispatch(
          getMessages({
            conversationId: choosenConversation,
            skip: length,
          })
        );
    }
  };
  const messagesData = messages[choosenConversation]
    ? [...messages[choosenConversation].data]
    : [];

  return (
    <Flex
      onScroll={handleOnScroll}
      ref={flexRef}
      direction="column"
      marginTop="auto"
      boxSizing="border-box"
      width="100%"
      maxHeight={{
        lg: '90%',
      }}
      minH="100px"
      padding="1rem"
      overflow={'auto'}
      gap="1rem"
    >
      {messagesData
        .sort((a, b) =>
          !a[0] || !b[0]
            ? 0
            : !a[0].createdAt || !b[0].createdAt
            ? 0
            : +a[0].createdAt - +b[0].createdAt
        )
        .map((group, index) => (
          <React.Fragment key={index}>
            {getMinCreated(group) -
              (index === 0 ? 0 : getMinCreated(messagesData[index - 1])) >
              MAX_TIME_DISTANCE && (
              <Flex
                width="calc(100% - 1rem)"
                marginX="auto"
                alignItems={'center'}
                gap="1rem"
              >
                <Divider orientation="horizontal" color={'black'} />
                <Text
                  whiteSpace={'nowrap'}
                  bg={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
                  rounded="lg"
                  paddingX=".5rem"
                >
                  {dailyFromNow(getMinCreated(group))}
                </Text>
                <Divider orientation="horizontal" color={'black'} />
              </Flex>
            )}
            {group[0].sender._id === myId ? (
              <MyGroup
                group={group}
                lastGroup={index === messagesData.length - 1}
              />
            ) : (
              <OtherGroup
                group={group}
                lastGroup={index === messagesData.length - 1}
              />
            )}
          </React.Fragment>
        ))}
      <div ref={divRef}></div>
    </Flex>
  );
}
