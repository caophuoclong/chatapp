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
import Picker, { Emoji, EmojiClickData } from 'emoji-picker-react';

import { useAppDispatch, useAppSelector } from '~/app/hooks';
import MessagesApi from '../../../services/apis/Messages.api';
import { addMessage, updateMessageScale } from '~/app/slices/messages.slice';
import {
  IMessage,
  MessageStatusType,
  MessageType,
} from '~/interfaces/IMessage';
import randomInt from '~/utils/randomInt';
import {
  updateLastestMessage,
  updateConversation,
} from '~/app/slices/conversations.slice';
import IConversation from '~/interfaces/IConversation';
import EmojiPicker from 'emoji-picker-react';
type Props = {
  conversation: IConversation;
};
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
export default function InputBox({ conversation }: Props) {
  const isLargerThanHD = useAppSelector(
    (state) => state.globalSlice.isLargerThanHD
  );
  const [content, setContent] = useState('');
  const [isPickerShow, setIsPickerShow] = useState(false);
  const { colorMode } = useColorMode();
  const [timeEmojiClick, setTimeEmojiClick] = useState<{
    time: number;
    state: 'down' | 'up';
    messageId: string;
    value: string;
  }>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.userSlice.info);
  const choosenConversationId = useAppSelector(
    (state) => state.globalSlice.conversation.choosenConversationID
  );
  const conversations = useAppSelector(
    (state) => state.conversationsSlice.conversations
  );

  const onPickerClick = (emoji: EmojiClickData, event: MouseEvent) => {
    console.log(emoji);
    setContent(content + emoji.emoji);
  };
  const pickerRef = useRef<HTMLDivElement>(null);
  useOutside(pickerRef, () => {
    setIsPickerShow(false);
  });
  const socket = useAppSelector((state) => state.globalSlice.socket);
  const sendMessage = async () => {
    const message: IMessage = {
      _id: (Date.now() + randomInt(0, 9999)).toString(),
      destination: choosenConversationId,
      content: content,
      attachments: [],
      parentMessage: null,
      status: MessageStatusType.SENDING,
      createdAt: Date.now(),
      sender: user,
      type: MessageType.TEXT,
    };
    try {
      dispatch(
        addMessage({ message: message, conversationId: choosenConversationId })
      );
      const updateAt = new Date().getTime();
      if (conversation)
        dispatch(
          updateConversation({
            ...conversation,
            lastMessage: message,
            updateAt,
          })
        );

      // const response = await MessagesApi.sendMessage(message);
      // const data = response.data.data;
      socket?.emit('createMessage', {
        ...message,
        updateAt,
      });

      setContent('');
    } catch (error) {
      console.log(error);
    }
  };
  const onSendEmoji = () => {
    const message = {
      _id: (Date.now() + randomInt(0, 9999)).toString(),
      destination: choosenConversationId,
      content: content,
      attachments: [],
      parentMessage: null,
      status: MessageStatusType.SENDING,
      createdAt: Date.now(),
      sender: user,
      type: MessageType.TEXT,
    };
  };
  const onEmojiDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { value } = e.currentTarget;
    const time = new Date().getTime();
    const id = (Date.now() + randomInt(0, 9999)).toString();
    setTimeEmojiClick({
      state: 'down',
      time: time / 1000,
      messageId: id,
      value,
    });
  };
  const onEmojiUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { value } = e.currentTarget;

    console.log(e.currentTarget.value);
    const time = new Date().getTime();
    setTimeEmojiClick((prev) => ({
      state: 'up',
      time: time / 1000 - (prev ? prev.time : 0),
      messageId: prev ? prev.messageId : '',
      value,
    }));
  };
  useEffect(() => {
    if (timeEmojiClick) {
      if (timeEmojiClick.state === 'down') {
        const message = {
          _id: timeEmojiClick.messageId,
          destination: choosenConversationId,
          content: timeEmojiClick.value,
          attachments: [],
          parentMessage: null,
          status: MessageStatusType.SENDING,
          createdAt: Date.now(),
          sender: user,
          scale: 1,
          type: MessageType.EMOJI,
        };
        dispatch(
          addMessage({
            message: message,
            conversationId: choosenConversationId,
          })
        );
        // dispatch(updateConversation({ ...conversation, lastMessage: message }));
      }
      const interval = setInterval(() => {
        if (timeEmojiClick && timeEmojiClick.state === 'down') {
          dispatch(
            updateMessageScale({
              conversationId: choosenConversationId,
              messageId: timeEmojiClick.messageId,
            })
          );
        }
      }, 150);
      if (timeEmojiClick && timeEmojiClick.state === 'up') {
        clearInterval(interval);
      }
      if (
        timeEmojiClick &&
        timeEmojiClick.state === 'up' &&
        timeEmojiClick.time >= 5
      ) {
        clearInterval(interval);
      }
      return () => clearInterval(interval);
    }

    // if (timeEmojiClick?.state === 'up' && timeEmojiClick.time < 5) {
    // const message = {
    //   _id: (Date.now() + randomInt(0, 9999)).toString(),
    //   destination: choosenConversationId,
    //   content: content,
    //   attachments: [],
    //   parentMessage: null,
    //   status: MessageStatusType.SENDING,
    //   createdAt: Date.now(),
    //   sender: user,
    // };
    // }
  }, [timeEmojiClick]);
  return (
    <Box
      marginTop="auto"
      boxSizing="border-box"
      position="relative"
      _dark={{
        bg: 'gray.800',
      }}
      bg="gray.100"
      paddingX={{
        base: '0rem',
        lg: '0rem',
      }}
      borderTop={
        colorMode === 'dark'
          ? '1px solid rgba(255, 255, 255,0.3)'
          : '1px solid  rgba(0, 0, 0, 0.08)'
      }
      // paddingY="0.3rem"
    >
      {isLargerThanHD && (
        <Flex paddingX="1rem">
          <IconButton
            justifyContent={'center'}
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
            justifyContent={'center'}
            aria-label="Photo"
            icon={<HiPhotograph fontSize={'24px'} />}
          />
          <IconButton
            bg="none"
            justifyContent={'center'}
            aria-label="File"
            icon={<GrAttachment fontSize={'24px'} />}
          />
        </Flex>
      )}
      <Flex
        gap="5px"
        paddingX={isLargerThanHD ? 0 : '1rem'}
        role="group"
        borderTop={
          colorMode === 'dark'
            ? '1px solid rgba(255, 255, 255,0.3)'
            : '1px solid  rgba(0, 0, 0, 0.08)'
        }
        transition="all 0.3s"
        _focusWithin={{
          borderTopColor: '#63b3ed',
        }}
      >
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
          variant={'unstyled'}
          value={content}
          placeholder="Flushed"
          size="md"
          width="100%"
          paddingX={{
            base: '0rem',
            lg: '1rem',
          }}
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
              onClick={sendMessage}
              aria-label="send message"
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
          <IconButton
            aria-label="Photo"
            onMouseUp={onEmojiUp}
            onMouseDown={onEmojiDown}
            value={
              (conversation.emoji &&
                conversation.emoji.userId === user._id &&
                conversation.emoji.emoji) as string
            }
            icon={
              <>
                {conversation.emoji &&
                conversation.emoji.userId === user._id ? (
                  <Emoji unified={conversation.emoji.emoji} />
                ) : (
                  <></>
                )}
              </>
            }
          />
        )}
      </Flex>
      {isPickerShow && (
        <Box
          ref={pickerRef}
          position={isLargerThanHD ? 'absolute' : 'relative'}
          top="0"
          transform={isLargerThanHD ? 'translate(0,-100%)' : 'translate(0,0)'}
          width={isLargerThanHD ? '258px' : '100%'}
        >
          <Picker onEmojiClick={onPickerClick} />
        </Box>
      )}
    </Box>
  );
}
