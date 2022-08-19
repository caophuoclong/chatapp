import { Box } from '@chakra-ui/react';
import React from 'react';
import MyMessage from './Message/MyMessage';
import OtherMessage from './Message/OtherMessage';

type Props = {};

export default function MessagesBox({}: Props) {
  return (
    <Box
      boxSizing="border-box"
      width="100%"
      maxHeight={{
        lg: '90%',
      }}
      paddingY="1rem"
      paddingX=".7rem"
      overflow={'auto'}
    >
      <MyMessage message="adsadasdasdadsa" time="123" />
      <OtherMessage message="2adsadasdasdas3" time="123" />
      <MyMessage message="adsadasdasdadsa" time="123" />
      <OtherMessage message="2adsadasdasdas3" time="123" />
    </Box>
  );
}
