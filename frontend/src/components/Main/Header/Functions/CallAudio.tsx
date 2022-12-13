import { IconButton } from '@chakra-ui/react';
import React from 'react';
import { IoCallSharp } from 'react-icons/io5';

type Props = {};

export default function CallAudio({}: Props) {
  return (
    <React.Fragment>
      <IconButton
        bg="none"
        rounded="full"
        aria-label="Call"
        icon={<IoCallSharp />}
      />
    </React.Fragment>
  );
}
