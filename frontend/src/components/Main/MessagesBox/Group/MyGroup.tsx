import { Box, Flex, useColorMode } from '@chakra-ui/react';
import React from 'react';
import { IMessage } from '~/interfaces/IMessage';
import Group from './index';
import { renderMessage } from '../index';
import { useAppSelector } from '~/app/hooks';
import Message from '../Message';

type Props = {
  group: IMessage[];
};

export default function MyGroup({ group }: Props) {
  const emojiStyle = useAppSelector((state) => state.globalSlice.emojiStyle);
  const { colorMode } = useColorMode();
  const maxCreatedAt = Math.max(
    ...group.map((message) => message.createdAt || 0)
  );
  return (
    <Group right>
      <Flex
        flexDirection={'column'}
        gap=".25rem"
        maxWidth="40%"
        alignItems="flex-end"
      >
        {[...group]
          .sort((a, b) => +(a.createdAt || 0) - +(b.createdAt || 0))
          .map((message, index) => (
            <Message
              isLast={group.length - 1 === index}
              key={message._id}
              _id={message._id}
              isRecall={message.isRecall}
              content={renderMessage(message, emojiStyle)}
              time={message.createdAt || 0}
              type={message.type}
              sender={message.sender}
            />
          ))}
      </Flex>
    </Group>
  );
}
