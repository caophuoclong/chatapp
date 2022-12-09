import { Box, Flex, useColorMode } from '@chakra-ui/react';
import React from 'react';
import { IMessage, MessageType } from '~/interfaces/IMessage';
import Group from './index';
import { renderMessage } from '../index';
import { useAppSelector } from '~/app/hooks';
import Message from '../Message';
import MessageImage from '../MessageImage';

type Props = {
  group: IMessage[];
  lastGroup: boolean;
};

export default function MyGroup({ group, lastGroup }: Props) {
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
    <Group right>
      <Flex
        flexDirection={'column'}
        gap=".25rem"
        maxWidth="40%"
        alignItems="flex-end"
      >
        {messages.map((group, index) =>
          group[0].type === MessageType.IMAGE ? (
            <MessageImage
              isLast={messages.length - 1 === index && lastGroup}
              messages={group}
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
                  _id={message._id}
                  isRecall={message.isRecall}
                  content={renderMessage(message, emojiStyle)}
                  time={message.createdAt || 0}
                  type={message.type}
                  sender={message.sender}
                  status={message.status}
                />
              ))}
            </React.Fragment>
          )
        )}
      </Flex>
    </Group>
  );
}
