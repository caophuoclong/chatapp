import {
  Box,
  Flex,
  IconButton,
  Input,
  useColorMode,
  useMediaQuery,
} from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { HiOutlineEmojiHappy, HiPhotograph } from 'react-icons/hi';
import { GrAttachment } from 'react-icons/gr';
import { FaTelegramPlane } from 'react-icons/fa';
import { FcLike } from 'react-icons/fc';
import Picker from 'emoji-picker-react';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import MessagesApi from '../../../services/apis/Messages.api';
import { addMessage } from '~/app/slices/messages.slice';
type Props = {};
function useOutside<T extends HTMLElement>(
  ref: React.RefObject<T>,
  setHidePicker: () => void
) {
  useEffect(() => {
    function listener(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setHidePicker();
      }
    }
    document.addEventListener('mousedown', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
    };
  }, [ref]);
}
export default function InputBox({}: Props) {
  const isLargerThanHD = useAppSelector(
    (state) => state.globalSlice.isLargerThanHD
  );
  const [content, setContent] = useState('');
  const [isPickerShow, setIsPickerShow] = useState(false);
  const { colorMode } = useColorMode();
  const dispatch = useAppDispatch();
  const choosenConversationId = useAppSelector(
    (state) => state.globalSlice.conversation.choosenConversationID
  );
  const onPickerClick = (
    event: any,
    emoji: {
      emoji: string;
    }
  ) => {
    setContent(content + emoji.emoji);
  };
  const pickerRef = useRef<HTMLDivElement>(null);
  useOutside(pickerRef, () => {
    setIsPickerShow(false);
  });
  const socket = useAppSelector((state) => state.globalSlice.socket);
  const sendMessage = async () => {
    const message = {
      destination: choosenConversationId,
      content: content,
      attachment: [],
      parentMessage: null,
    };
    try {
      // const response = await MessagesApi.sendMessage(message);
      // const data = response.data.data;
      socket?.emit('createMessage', message);

      // dispatch(
      //   addMessage({ message: data, conversationId: choosenConversationId })
      // );
      setContent('');
    } catch (error) {
      console.log(error);
    }
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
      // paddingY="0.3rem"
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
            bg="none"
            aria-label="Photo"
            icon={<HiPhotograph fontSize={'24px'} />}
          />
          <IconButton
            bg="none"
            aria-label="File"
            icon={<GrAttachment fontSize={'24px'} />}
          />
        </Flex>
      )}
      <Flex gap="5px" paddingX={isLargerThanHD ? 0 : '1rem'}>
        {/* {!isLargerThanHD && (
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
        )} */}
        <Input
          variant={!isLargerThanHD ? 'unstyled' : 'flushed'}
          value={content}
          placeholder="Flushed"
          size="md"
          width="100%"
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setContent(event.target.value);
          }}
        />
        {!isLargerThanHD ? (
          content ? (
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
        ) : content ? (
          <IconButton
            onClick={sendMessage}
            aria-label="send message"
            icon={<FaTelegramPlane fontSize={'24px'} />}
          />
        ) : (
          <IconButton aria-label="Photo" icon={<FcLike fontSize={'24px'} />} />
        )}
      </Flex>
      {isPickerShow && (
        <div ref={pickerRef}>
          <Picker
            onEmojiClick={onPickerClick}
            pickerStyle={{
              position: isLargerThanHD ? 'absolute' : 'relative',
              top: '0',
              transform: isLargerThanHD
                ? 'translate(0,-100%)'
                : 'translate(0,0)',
              width: isLargerThanHD ? '258px' : '100%',
            }}
          />
        </div>
      )}
    </Box>
  );
}
