import { Button, Flex } from '@chakra-ui/react';
import React, { useState } from 'react';
import CallAudio from './CallAudio';
import CallVideo from './CallVideo';
import ShowMoreConversation from './ShowMoreConversation';
import { IMediaConstraints } from '../../../../interfaces/IMediaContraints';

type Props = {};

export default function HeaderFuntions({}: Props) {
  const [media, setMedia] = useState<MediaStream>();
  const openMediaDevices = async (contraints: IMediaConstraints) => {
    // try {
    //   const stream = await navigator.mediaDevices.getUserMedia(contraints);
    //   setMedia(stream);
    //   console.log(
    //     '🚀 ~ file: index.tsx:14 ~ openMediaDevices ~ stream',
    //     stream
    //   );
    // } catch (error) {
    //   console.log('🚀 ~ file: index.tsx:17 ~ openMediaDevices ~ error', error);
    // }
  };
  const stopMedia = () => {
    console.log(media);
    media?.getTracks().forEach((track) => track.stop());
  };
  return (
    <Flex marginLeft="auto" gap=".4rem">
      <CallVideo openMediaDevices={openMediaDevices} />
      <CallAudio openMediaDevices={openMediaDevices} />
      <Button onClick={() => stopMedia()}>Exit</Button>
      <ShowMoreConversation />
    </Flex>
  );
}
