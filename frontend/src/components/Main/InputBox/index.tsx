import {
  Box,
  Flex,
  IconButton,
  Input,
  useColorMode,
  useMediaQuery,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { HiOutlineEmojiHappy, HiPhotograph } from 'react-icons/hi';
import { GrAttachment } from 'react-icons/gr';
import { FaTelegramPlane } from 'react-icons/fa';
import { FcLike } from 'react-icons/fc';
import Picker from 'emoji-picker-react';
import { useAppSelector } from '~/app/hooks';
type Props = {};

export default function InputBox({}: Props) {
  const isLargerThanHD = useAppSelector(
    (state) => state.globalSlice.isLargerThanHD
  );
  const [message, setMessage] = useState('');
  const [isPickerShow, setIsPickerShow] = useState(false);
  const { colorMode } = useColorMode();
  const onPickerClick = (
    event: any,
    emoji: {
      emoji: string;
    }
  ) => {
    setMessage(message + emoji.emoji);
  };
  return (
    <Box
      marginTop="auto"
      boxSizing="border-box"
      position="relative"
      minHeight={{
        base: '6%',
        lg: '5%',
      }}
      _dark={{
        bg: 'gray.800',
      }}
      bg="gray.100"
      paddingX={{
        base: '0rem',
        lg: '1rem',
      }}
      borderTop={
        colorMode === 'dark'
          ? '1px solid rgba(255, 255, 255,0.3)'
          : '1px solid  rgba(0, 0, 0, 0.08)'
      }
      paddingY="0.3rem"
    >
      {isLargerThanHD && (
        <Flex>
          <IconButton
            onClick={() => setIsPickerShow(!isPickerShow)}
            aria-label="Emoji"
            bg={isPickerShow ? 'gray.200' : 'none'}
            icon={
              <HiOutlineEmojiHappy
                fontSize={'24px'}
                color={isPickerShow ? '#63B3ED' : ''}
              />
            }
          />
          <IconButton
            aria-label="Photo"
            icon={<HiPhotograph fontSize={'24px'} />}
          />
          <IconButton
            aria-label="File"
            icon={<GrAttachment fontSize={'24px'} />}
          />
        </Flex>
      )}
      <Flex gap="5px">
        {!isLargerThanHD && (
          <IconButton
            onClick={() => setIsPickerShow(!isPickerShow)}
            aria-label="Emoji"
            bg={isPickerShow ? 'gray.200' : 'none'}
            icon={
              <HiOutlineEmojiHappy
                fontSize={'24px'}
                color={isPickerShow ? '#63B3ED' : ''}
              />
            }
          />
        )}
        <Input
          variant="flushed"
          value={message}
          placeholder="Flushed"
          size="md"
          width="100%"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setMessage(event.target.value);
          }}
        />
        {!isLargerThanHD ? (
          message ? (
            <IconButton
              aria-label="Photo"
              icon={<FaTelegramPlane fontSize={'24px'} />}
            />
          ) : (
            <IconButton
              aria-label="Photo"
              icon={<HiPhotograph fontSize={'24px'} />}
            />
          )
        ) : message ? (
          <IconButton
            aria-label="Photo"
            icon={<FaTelegramPlane fontSize={'24px'} />}
          />
        ) : (
          <IconButton aria-label="Photo" icon={<FcLike fontSize={'24px'} />} />
        )}
      </Flex>
      {isPickerShow && (
        <Picker
          onEmojiClick={onPickerClick}
          pickerStyle={{
            position: isLargerThanHD ? 'absolute' : 'relative',
            top: '0',
            transform: isLargerThanHD ? 'translate(0,-100%)' : 'translate(0,0)',
            width: isLargerThanHD ? '258px' : '100%',
          }}
        />
      )}
    </Box>
  );
}
