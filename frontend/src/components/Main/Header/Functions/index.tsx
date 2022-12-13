import { Flex } from '@chakra-ui/react';
import React from 'react';
import CallAudio from './CallAudio';
import CallVideo from './CallVideo';
import ShowMoreConversation from './ShowMoreConversation';

type Props = {};

export default function HeaderFuntions({}: Props) {
  return (
    <Flex marginLeft="auto" gap=".4rem">
      <CallVideo />
      <CallAudio />
      <ShowMoreConversation />
    </Flex>
  );
}
