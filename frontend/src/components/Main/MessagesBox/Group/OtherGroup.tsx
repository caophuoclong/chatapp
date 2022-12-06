import { Box, Flex, useColorMode } from '@chakra-ui/react';
import moment from 'moment';
import React from 'react';
import { useAppSelector } from '~/app/hooks';
import { IMessage } from '~/interfaces/IMessage';
import { renderMessage } from '..';
import Message from '../Message';
import Group from './index';

type Props = {
  group: IMessage[];
};

export default function OtherGroup({ group }: Props) {
  const emojiStyle = useAppSelector((state) => state.globalSlice.emojiStyle);
  const { colorMode } = useColorMode();
  const maxCreatedAt = Math.max(
    ...group.map((message) => message.createdAt || 0)
  );
  return (
    <Group>
      <Flex
        flexDirection={'column'}
        gap=".25rem"
        maxWidth="40%"
        alignItems="flex-start"
      >
        {[...group]
          .sort((a, b) => +(a.createdAt || 0) - +(b.createdAt || 0))
          .map((message, index) => (
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
          ))}
      </Flex>
    </Group>
  );
}
