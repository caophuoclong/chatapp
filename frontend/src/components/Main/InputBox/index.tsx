import {
  Box,
  Button,
  CloseButton,
  Flex,
  HStack,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useColorMode,
  useDisclosure,
  useMediaQuery,
  useToast,
  VStack,
} from '@chakra-ui/react';
import React, { Reducer, useEffect, useReducer, useRef, useState } from 'react';
import { HiOutlineEmojiHappy, HiPhotograph } from 'react-icons/hi';
import { GrAttachment } from 'react-icons/gr';
import { FaTelegramPlane, FaTimes } from 'react-icons/fa';
import { FcLike } from 'react-icons/fc';
import Picker, {
  Emoji,
  EmojiClickData,
  EmojiStyle,
  Theme,
} from 'emoji-picker-react';

import { useAppDispatch, useAppSelector } from '~/app/hooks';
import MessagesApi from '../../../services/apis/Messages.api';
import {
  addMessage,
  removeMessage,
  sendMessageThunk,
  updateMessageScale,
  updateSentMessage,
} from '~/app/slices/messages.slice';
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
import {
  clearEmojiInterval,
  EmojiAction,
  EmojiReducer,
  IinitialEmojiState,
  initialEmojiState,
  setDefault,
  setEmojiContent,
  setEmojiInterval,
  setMessageId,
  setState,
  setTime,
} from './EmojiState/reducer';
import CustomPickerEmoji from './CustomPickerEmoji';
import { useTranslation } from 'react-i18next';
import { FiMoreHorizontal } from 'react-icons/fi';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { MdLibraryAdd } from 'react-icons/md';
import { unwrapResult } from '@reduxjs/toolkit';
import { EMOJI_SCALE_EVERY, TIME_SCALE } from '~/configs';
import { useCountUp } from 'react-countup';
import { sendMessageAsFile } from '~/utils/sendMessageAsFile';
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
  const [countUp, setCountUp] = useState(0);
  const countUpRef = React.useRef(null);
  const { t } = useTranslation();
  const isLargerThanHD = useAppSelector(
    (state) => state.globalSlice.isLargerThanHD
  );
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [isMore, setIsMore] = useState(false);
  const [content, setContent] = useState('');
  const [isPickerShow, setIsPickerShow] = useState(false);
  const { colorMode } = useColorMode();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [emojiState, emojiDispatch] = useReducer<
    Reducer<IinitialEmojiState, EmojiAction>
  >(EmojiReducer, initialEmojiState);
  useEffect(() => {
    if (emojiState.state === 'down') {
      emojiDispatch(setTime(countUp));
    }
  }, [countUp, emojiState.state]);
  const isDark = useColorMode();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.userSlice.info);
  const choosenConversationId = useAppSelector(
    (state) => state.globalSlice.conversation.choosenConversationID
  );
  const onPickerClick = (emoji: EmojiClickData, event: MouseEvent) => {
    setContent(content + emoji.emoji);
  };
  const pickerRef = useRef<HTMLDivElement>(null);
  useOutside(pickerRef, () => {
    setIsPickerShow(false);
  });
  const messages = useAppSelector((state) => state.messageSlice.messages)[
    choosenConversationId
  ];
  const createRawMessage = (
    type: MessageType,
    content: string,
    createdAt?: number
  ) => {
    const message: IMessage = {
      _id: (Date.now() + randomInt(0, 9999)).toString(),
      destination: choosenConversationId,
      parentMessage: null,
      status: MessageStatusType.SENDING,
      sender: user,
      content,
      type: type,
      isRecall: false,
      createdAt: createdAt || Date.now(),
    };
    return message;
  };
  const sendMessage = (message: IMessage) => {
    return new Promise(async (resolve, reject) => {
      try {
        const updateAt = new Date().getTime();
        const unwrap = await dispatch(sendMessageThunk({ message, updateAt }));
        const result = unwrapResult(unwrap);
        const { message: message1, tempId } = result;
        dispatch(
          updateSentMessage({
            tempId: tempId,
            message: message1,
            lastMessage: conversation.lastMessage,
          })
        );
        if (conversation)
          dispatch(
            updateConversation({
              conversationId: conversation._id,
              conversation: {
                lastMessage: message1,
                updateAt,
              },
            })
          );
        resolve('success');
      } catch (error) {
        reject(error);
      }
    });
  };
  const emojiStyle = useAppSelector((state) => state.globalSlice.emojiStyle);
  const handleSendMessage = async () => {
    const message: IMessage = {
      _id: (Date.now() + randomInt(0, 9999)).toString(),
      destination: choosenConversationId,
      content: content,
      parentMessage: null,
      status: MessageStatusType.SENDING,
      sender: user,
      type: MessageType.TEXT,
      isRecall: false,
      createdAt: Date.now(),
    };
    try {
      sendMessage(message).then(() => {
        setContent('');
      });
    } catch (error) {
      console.log(error);
    }
  };
  const [altPress, setAltPress] = useState(false);
  const [enterPress, setEnterPress] = useState(false);
  const handleOnRightClickEmoji = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (e.button === 2) {
      onOpen();
    }
  };

  const onEmojiDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { value } = e.currentTarget;
    const time = new Date().getTime();
    const id = (Date.now() + randomInt(0, 9999)).toString();
    if (e.button === 0) {
      emojiDispatch(setState('down'));
      emojiDispatch(setMessageId(id));
      emojiDispatch(setEmojiContent(value));
    }
  };
  const onEmojiUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { value } = e.currentTarget;
    e.preventDefault();
    const time = new Date().getTime();
    emojiDispatch(setState('up'));
  };

  useEffect(() => {
    console.log(emojiState);
    (async () => {
      if (emojiState) {
        if (emojiState.state === 'down') {
          const message = {
            _id: emojiState.messageId,
            destination: choosenConversationId,
            content: emojiState.content,
            attachments: [],
            parentMessage: null,
            status: MessageStatusType.SENDING,
            createdAt: Date.now(),
            sender: user,
            scale: 1,
            type: MessageType.EMOJI,
            isRecall: false,
          };
          dispatch(
            addMessage({
              message: message,
              conversationId: choosenConversationId,
            })
          );
          if (emojiState.interval === false) {
            emojiDispatch(setTime(0));
            const interval = setInterval(() => {
              setCountUp((prev) => prev + EMOJI_SCALE_EVERY);
            }, EMOJI_SCALE_EVERY);
            emojiDispatch(setEmojiInterval(interval));
          }
        }
        if (
          emojiState &&
          emojiState.state === 'up' &&
          emojiState.time < TIME_SCALE
        ) {
          const { messageId } = emojiState;
          let message: IMessage = {} as IMessage;
          messages.data.forEach((group) =>
            group.forEach((m) => m._id === messageId && (message = m))
          );
          if (conversation && message) {
            emojiDispatch(clearEmojiInterval());
            setCountUp(0);
            try {
              await sendMessage(message);
            } catch (error) {}
          }
        }
        return () => emojiDispatch(clearEmojiInterval());
      }
    })();
  }, [emojiState.state]);
  useEffect(() => {
    console.log(emojiState);
  }, [emojiState.time]);
  useEffect(() => {
    if (messages) {
      let message: IMessage | undefined = undefined;
      messages.data.forEach((group) =>
        group.forEach((m) => m._id === emojiState.messageId && (message = m))
      );
      if (message && emojiState.state === 'down') {
        if (emojiState.time < TIME_SCALE)
          dispatch(
            updateMessageScale({
              conversationId: choosenConversationId,
              messageId: emojiState.messageId,
            })
          );
        else {
          setCountUp(0);
          emojiDispatch(clearEmojiInterval());
          emojiDispatch(setDefault());
          dispatch(
            removeMessage({
              conversationID: choosenConversationId,
              messageID: emojiState.messageId,
            })
          );
        }
      }
    }
  }, [emojiState.time]);
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.altKey) {
      setAltPress(true);
    }
    if (event.key === 'Enter') {
      setEnterPress(true);
      event.preventDefault();
    }
  };
  const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
    setAltPress(false);
    setEnterPress(false);
  };
  useEffect(() => {
    if (altPress && enterPress) {
      setContent((prev) => prev + '<div><br></div>');
    }
  }, [altPress, enterPress]);
  useEffect(() => {
    if (!altPress && enterPress && content.length > 1) {
      const testContent = content.replace(/<[^>]*>?/gm, '');
      if (testContent.length >= 1) {
        handleSendMessage();
      } else {
        setContent('');
      }
    }
  }, [content, enterPress]);
  const [previewImages, setPreviewImages] = useState<
    Array<{
      name: string;
      url: string;
    }>
  >([]);
  const handleUploadImages = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { files } = event.target;
    await sendMessageAsFile(
      files,
      user,
      choosenConversationId,
      MessageType.IMAGE,
      conversation.lastMessage,
      dispatch
    );
    if (inputFileRef.current) {
      inputFileRef.current.value = '';
    }
  };
  const toast = useToast();
  return (
    <Box
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
      <div ref={countUpRef}></div>
      {isLargerThanHD && previewImages.length === 0 && (
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
            as="label"
            cursor={'pointer'}
            htmlFor="imagesupload"
            aria-label="Photo"
            icon={<HiPhotograph fontSize={'24px'} />}
          />
          <IconButton
            bg="none"
            as="label"
            justifyContent={'center'}
            htmlFor="attachUpload"
            aria-label="File"
            icon={<GrAttachment fontSize={'24px'} />}
          />
        </Flex>
      )}
      <input
        ref={inputFileRef}
        id="imagesupload"
        accept="image/png, image/jpeg, image/jpg"
        multiple
        type="file"
        hidden
        onChange={handleUploadImages}
      />
      <input ref={inputFileRef} id="attachUpload" multiple type="file" hidden />
      <Flex
        gap="5px"
        paddingY=".5rem"
        paddingX={isLargerThanHD ? 0 : '.5rem'}
        role="group"
        borderTop={
          previewImages.length > 0
            ? 'none'
            : colorMode === 'dark'
            ? '1px solid rgba(255, 255, 255,0.3)'
            : '1px solid  rgba(0, 0, 0, 0.08)'
        }
        transition="all 0.3s"
        _focusWithin={{
          borderTopColor: '#63b3ed',
        }}
      >
        <Flex width={'calc(100% - 32px)'}>
          {!isMore ? (
            <ContentEditable
              className="content__editable"
              html={content}
              placeholder={t('Type__Message')}
              style={{
                width: '100%',
                outline: 'none',
                fontSize: '1.2rem',
                maxHeight: '7rem',
                overflowY: 'auto',
                paddingLeft: '0.5rem',
                italic: content.length < 1,
              }}
              onChange={(e: ContentEditableEvent) => {
                setContent(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
            />
          ) : (
            <></>
          )}
        </Flex>

        {!isLargerThanHD ? (
          content ? (
            <IconButton
              alignSelf={'flex-end'}
              size="sm"
              onClick={handleSendMessage}
              aria-label="send message"
              icon={<FaTelegramPlane fontSize={'24px'} />}
            />
          ) : (
            <>
              <IconButton
                alignSelf={'flex-end'}
                size="sm"
                aria-label="Emoji"
                onMouseUp={onEmojiUp}
                onMouseDown={onEmojiDown}
                onContextMenu={handleOnRightClickEmoji}
                value={
                  (conversation.emoji &&
                    conversation.emoji.userId === user._id &&
                    conversation.emoji.emoji) as string
                }
                icon={
                  <>
                    {conversation.emoji &&
                    conversation.emoji.userId === user._id ? (
                      <Emoji
                        unified={conversation.emoji.emoji}
                        emojiStyle={emojiStyle}
                        size={24}
                      />
                    ) : (
                      <></>
                    )}
                  </>
                }
              />
              <IconButton
                alignSelf={'flex-end'}
                onClick={() => {
                  setIsMore(!isMore);
                }}
                aria-label="show more"
                size="sm"
                icon={<FiMoreHorizontal fontSize={'24px'} />}
              />
            </>
          )
        ) : content ? (
          <IconButton
            alignSelf={'flex-end'}
            onClick={handleSendMessage}
            aria-label="send message"
            icon={<FaTelegramPlane fontSize={'24px'} />}
          />
        ) : (
          <IconButton
            alignSelf={'flex-end'}
            aria-label="Emoji"
            onMouseUp={onEmojiUp}
            onMouseDown={onEmojiDown}
            onContextMenu={handleOnRightClickEmoji}
            value={
              (conversation.emoji &&
                conversation.emoji.userId === user._id &&
                conversation.emoji.emoji) as string
            }
            icon={
              <>
                {conversation.emoji &&
                conversation.emoji.userId === user._id ? (
                  <Emoji
                    unified={conversation.emoji.emoji}
                    emojiStyle={emojiStyle}
                  />
                ) : (
                  <></>
                )}
              </>
            }
          />
        )}
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            borderBottom={
              colorMode === 'dark'
                ? '1px solid rgba(255, 255, 255,0.3)'
                : '1px solid  rgba(0, 0, 0, 0.08)'
            }
          >
            {t('Emoji__Settings')}
          </ModalHeader>
          <Text size="sm" marginY="1rem" paddingX="1.5rem">
            {t('Emoji__Settings__Detail')}
          </Text>
          <ModalBody padding="0">
            <CustomPickerEmoji />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              {t('Cancel')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {isPickerShow && (
        <Box
          ref={pickerRef}
          position={isLargerThanHD ? 'absolute' : 'relative'}
          top="0"
          transform={isLargerThanHD ? 'translate(0,-100%)' : 'translate(0,0)'}
          width={isLargerThanHD ? '258px' : '100%'}
        >
          <Picker
            onEmojiClick={onPickerClick}
            theme={isDark.colorMode === 'dark' ? Theme.DARK : Theme.LIGHT}
            emojiStyle={emojiStyle}
          />
        </Box>
      )}
    </Box>
  );
}
