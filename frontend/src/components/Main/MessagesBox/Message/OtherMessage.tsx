import { Box, Flex, Text, useColorMode } from '@chakra-ui/react';
import React, { useEffect, useRef } from 'react';
import { MessageType } from '../../../../interfaces/IMessage';
import { useTranslation } from 'react-i18next';

type Props = {
  message: React.ReactNode | string;
  time: string;
  type: MessageType;
  isRecall: boolean;
};

export default function OtherMessage({ message, time, type, isRecall }: Props) {
  const { colorMode } = useColorMode();
  const showMessageRef = useRef<any>();
  const { t } = useTranslation();
  useEffect(() => {
    const current = showMessageRef.current;
    console.log(message === '//ThisMessageHasBeenRecalled//');
    if (current) {
      let x = message;
      if (message === '//ThisMessageHasBeenRecalled//') {
        x = t('This__Message__HasBeen__Recalled');
      }
      if (type === MessageType.TEXT) current.innerHTML = x;
      else {
        console.log(message);
      }
      console.log(x);
    }
  }, [showMessageRef, message]);
  return (
    <Flex
      maxWidth="80%"
      paddingX="1rem"
      // bg={
      //   type === MessageType.TEXT
      //     ? colorMode === 'light'
      //       ? 'white'
      //       : 'whiteAlpha.300'
      //     : 'none'
      // }
      minWidth="100px"
      width="fit-content"
      // boxShadow="rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px"
      className="message"
    >
      <Flex flexDirection={'column'} width="100%">
        <Text
          fontSize={'16px'}
          wordBreak="break-word"
          padding=".5rem"
          rounded="lg"
          roundedBottomLeft={'none'}
          color={
            isRecall ? 'gray.500' : colorMode === 'light' ? 'black' : 'white'
          }
          bg={
            type === MessageType.TEXT
              ? colorMode === 'light'
                ? 'gray.300'
                : 'gray.700'
              : 'none'
          }
        >
          {isRecall ? t('This__Message__HasBeen__Recalled') : message}
        </Text>
        <Text
          justifySelf={'flex-end'}
          alignSelf={'flex-end'}
          fontSize={'13px'}
          color={colorMode === 'light' ? '#4F5359' : 'gray'}
          align="left"
        >
          {time}
        </Text>
      </Flex>
    </Flex>
  );
}
