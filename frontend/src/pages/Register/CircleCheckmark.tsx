import { Box } from '@chakra-ui/react';
import React from 'react';

type Props = {
  isDone: boolean;
};

export default function CircleCheckmark({ isDone }: Props) {
  return (
    <Box
      className={`circle-loader ${isDone ? 'load-complete' : ''}`}
      alignSelf="center"
    >
      <div className={`checkmark draw ${isDone ? 'd-block' : ''}`}></div>
    </Box>
  );
}
