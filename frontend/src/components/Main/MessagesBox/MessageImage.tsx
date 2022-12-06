import { Flex, Image } from '@chakra-ui/react';
import React from 'react';

type Props = {
  attachments: string[];
};

export default function MessageImage({ attachments }: Props) {
  return (
    <>
      {attachments.length === 1 && (
        <Image
          marginRight={0}
          width={'270.1px'}
          height={'370px'}
          key={attachments[0]}
          src={attachments[0]}
          rounded="lg"
        />
      )}
      {attachments.length > 1 && attachments.length <= 2 && (
        <Flex width={'400px'} gap=".5rem" justifyContent={'right'}>
          {attachments.map((attachment, index) => (
            <Image
              border={'0.5px solid white'}
              maxWidth={'50%'}
              width="182.5px"
              height={'250px'}
              key={attachment}
              src={attachment}
              rounded="lg"
            />
          ))}
        </Flex>
      )}
      {attachments.length > 2 && (
        <Flex
          flexWrap={'wrap'}
          gap="0.5rem"
          width="400px"
          justifyContent={'flex-end'}
        >
          {attachments.map((attachment, index) => (
            <Image
              border={'0.5px solid white'}
              width={index > 0 && index % 3 === 0 ? '100%' : '32%'}
              height={'170px'}
              key={attachment}
              src={attachment}
              rounded="lg"
            />
          ))}
        </Flex>
      )}
    </>
  );
}
