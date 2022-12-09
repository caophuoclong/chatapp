import { Box, Flex, useColorMode } from '@chakra-ui/react';
import moment from 'moment';
import React from 'react';
import { useAppSelector } from '~/app/hooks';
import { IMessage, MessageType } from '~/interfaces/IMessage';
import { renderMessage } from '..';
import Message from '../Message';
import MessageImage from '../MessageImage';
import Group from './index';

type Props = {
  group: IMessage[];
  lastGroup: boolean;
};

export default function OtherGroup({ group, lastGroup }: Props) {
  const emojiStyle = useAppSelector((state) => state.globalSlice.emojiStyle);
  const { colorMode } = useColorMode();
  const groupMessages = [...group].sort(
    (a, b) => +(a.createdAt || 0) - +(b.createdAt || 0)
  );
  const messages = [];
  let temp = [];
  for (let i = 0; i < groupMessages.length; i++) {
    temp.push(groupMessages[i]);
    if (
      groupMessages[i + 1] &&
      groupMessages[i].type !== groupMessages[i + 1].type &&
      ((groupMessages[i].type === MessageType.IMAGE &&
        groupMessages[i + 1].type !== MessageType.IMAGE) ||
        (groupMessages[i].type !== MessageType.IMAGE &&
          groupMessages[i + 1].type === MessageType.IMAGE))
    ) {
      messages.push(temp);
      temp = [];
    }
    if (
      groupMessages[i + 1] &&
      groupMessages[i].type === MessageType.IMAGE &&
      groupMessages[i + 1].type === MessageType.IMAGE &&
      groupMessages[i].createdAt !== groupMessages[i + 1].createdAt
    ) {
      messages.push(temp);
      temp = [];
    }
    if (i === groupMessages.length - 1) messages.push(temp);
  }
  return (
    <Group>
      <Flex
        flexDirection={'column'}
        gap=".25rem"
        maxWidth="40%"
        alignItems="flex-start"
      >
        {messages.map((group, index) =>
          group[0].type === MessageType.IMAGE ? (
            <MessageImage
              isLast={messages.length - 1 === index && lastGroup}
              messages={group}
              other
              key={index}
            />
          ) : (
            <React.Fragment key={index}>
              {group.map((message, jndex) => (
                <Message
                  isLast={
                    group.length - 1 === jndex &&
                    index === messages.length - 1 &&
                    lastGroup
                  }
                  key={message._id}
                  isRecall={message.isRecall}
                  content={renderMessage(message, emojiStyle)}
                  type={message.type}
                  _id={message._id}
                  time={message.createdAt || 0}
                  other
                  sender={message.sender}
                />
              ))}
            </React.Fragment>
          )
        )}
      </Flex>
    </Group>
  );
}

/*
<Message
              isLast={group.length - 1 === index}
              key={message._id}
              isRecall={message.isRecall}
              content={renderMessage(message, emojiStyle)}
              type={message.type}
              _id={message._id}
              time={message.createdAt || 0}
              other
              sender={message.sender}
            />
*/
