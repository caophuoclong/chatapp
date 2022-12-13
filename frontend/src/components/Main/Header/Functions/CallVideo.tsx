import { IconButton } from '@chakra-ui/react';
import React from 'react';
import { BsCameraVideoFill } from 'react-icons/bs';

type Props = {};

export default function CallVideo({}: Props) {
  return (
    <React.Fragment>
      <IconButton
        bg="none"
        rounded="full"
        aria-label="Call video"
        icon={<BsCameraVideoFill />}
      />
    </React.Fragment>
  );
}
