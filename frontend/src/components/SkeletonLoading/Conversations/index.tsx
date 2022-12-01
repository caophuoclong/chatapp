import { Box, Flex, SkeletonCircle, SkeletonText } from '@chakra-ui/react';
import React from 'react';

type Props = {};

export default function SkeletonConversation({}: Props) {
  return (
    <Flex width={'100%'} gap={2} margin="1rem" marginInline={0}>
      <Box width="20%">
        <SkeletonCircle size="16" />
      </Box>
      <Box width="80%">
        <SkeletonText
          mt="4"
          noOfLines={1}
          spacing="4"
          skeletonHeight="2"
          width={'40%'}
        />
        <SkeletonText
          mt="4"
          noOfLines={1}
          spacing="4"
          skeletonHeight="2"
          width={'90%'}
        />
      </Box>
    </Flex>
  );
}
