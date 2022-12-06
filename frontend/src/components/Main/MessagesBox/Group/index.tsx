import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

type Props = {
  children: JSX.Element;
  right?: boolean;
};

export default function Group({ children, right }: Props) {
  return (
    <Flex width="100%" justifyContent={right ? 'flex-end' : 'flex-start'}>
      {children}
    </Flex>
  );
}
