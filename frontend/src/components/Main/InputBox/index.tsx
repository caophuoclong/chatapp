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
  updateMessageScale,
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
  EmojiAction,
  EmojiReducer,
  IinitialEmojiState,
  initialEmojiState,
  setDefault,
  setEmojiContent,
  setMessageId,
  setState,
  setTime,
} from './EmojiState/reducer';
import CustomPickerEmoji from './CustomPickerEmoji';
import { useTranslation } from 'react-i18next';
import { FiMoreHorizontal } from 'react-icons/fi';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { MdLibraryAdd } from 'react-icons/md';
const TIME_SCALE = 1500;
const EMOJI_SCALE_EVERY = 100;
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
  const { t } = useTranslation();
  const isLargerThanHD = useAppSelector(
    (state) => state.globalSlice.isLargerThanHD
  );
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [isMore, setIsMore] = useState(false);
  const [content, setContent] = useState('');
  const [isPickerShow, setIsPickerShow] = useState(false);
  const { colorMode } = useColorMode();
  const [emojiState, emojiDispatch] = useReducer<
    Reducer<IinitialEmojiState, EmojiAction>
  >(EmojiReducer, initialEmojiState);
  const isDark = useColorMode();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.userSlice.info);
  const choosenConversationId = useAppSelector(
    (state) => state.globalSlice.conversation.choosenConversationID
  );
  const lan = useAppSelector((state) => state.globalSlice.lan);
  const contentRef = useRef<any>('');
  const onPickerClick = (emoji: EmojiClickData, event: MouseEvent) => {
    console.log(emoji);
    setContent(content + emoji.emoji);
  };
  const pickerRef = useRef<HTMLDivElement>(null);
  useOutside(pickerRef, () => {
    setIsPickerShow(false);
  });
  const messages = useAppSelector((state) => state.messageSlice.messages)[
    choosenConversationId
  ];
  const socket = useAppSelector((state) => state.globalSlice.socket);
  const emojiStyle = useAppSelector((state) => state.globalSlice.emojiStyle);
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
      socket?.emit('createMessage', {
        ...message,
        updateAt,
      });

      setContent('');
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
    // handleOnRightClickEmoji(e);
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
    if (emojiState) {
      let interval: any;
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
        };
        dispatch(
          addMessage({
            message: message,
            conversationId: choosenConversationId,
          })
        );
        interval = setInterval(() => {
          if (emojiState.state === 'down') {
            emojiDispatch(setTime(emojiState.time + EMOJI_SCALE_EVERY));
          }
        }, EMOJI_SCALE_EVERY);
      }

      if (
        emojiState &&
        emojiState.state === 'up' &&
        emojiState.time < TIME_SCALE
      ) {
        const { messageId } = emojiState;
        const message = messages.data.find(
          (message) => message._id === messageId
        );
        console.log(
          '🚀 ~ file: index.tsx ~ line 204 ~ useEffect ~ message',
          message
        );
        const updateAt = new Date().getTime();
        if (conversation && message) {
          dispatch(
            updateConversation({
              ...conversation,
              lastMessage: message!,
              updateAt,
            })
          );
          socket?.emit('createMessage', {
            ...message,
            updateAt,
          });
          emojiDispatch(setDefault());
          clearInterval(interval);
        }
      }
      if (emojiState && emojiState.time >= TIME_SCALE) {
        clearInterval(interval);
        dispatch(
          removeMessage({
            conversationID: choosenConversationId,
            messageID: emojiState.messageId,
          })
        );
        emojiDispatch(setDefault());
      }
      return () => clearInterval(interval);
    }
  }, [emojiState.state, emojiState.time]);
  useEffect(() => {
    if (messages) {
      const message = messages.data.find((m) => m._id === emojiState.messageId);
      if (message && emojiState.state === 'down') {
        dispatch(
          updateMessageScale({
            conversationId: choosenConversationId,
            messageId: emojiState.messageId,
          })
        );
      }
    }
  }, [emojiState.time]);
  useEffect(() => {
    if (altPress && enterPress) {
      setContent(content + '<div><br></div>');
    }
  }, [altPress, enterPress]);
  useEffect(() => {
    if (!altPress && enterPress && content.length > 1) {
      const testContent = content.replace(/<[^>]*>?/gm, '');
      if (testContent.length >= 1) {
        sendMessage();
      } else {
        setContent('');
      }
    }
  }, [content, enterPress]);
  const uploadImageRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<File[] | null>(null);
  const [previewImages, setPreviewImages] = useState<
    Array<{
      name: string;
      url: string;
    }>
  >([]);
  useEffect(() => {
    if (images) {
      const previewImage = images.map((image) => {
        return {
          name: image.name,
          url: URL.createObjectURL(image),
        };
      });
      setPreviewImages(previewImage);
    }
  }, [images]);
  useEffect(() => {
    console.log(previewImages);
  }, [previewImages]);
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
            onClick={() => {
              toast({
                title: t('Info'),
                description: t('Feat__Developing'),
                status: 'info',
                position: isLargerThanHD ? 'top-right' : 'bottom',
                duration: 1000,
              });
              // const input = uploadImageRef.current;
              // if (input) {
              //   input.click();
              // }
            }}
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
      <input
        accept="image/png, image/jpeg, image/jpg"
        multiple
        ref={uploadImageRef}
        type="file"
        hidden
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const files = e.target.files;
          if (files && images && images.length > 0) {
            setImages([...images, ...Array.from(files)]);
          } else if (files) {
            setImages(Array.from(files));
          }
        }}
      />
      {previewImages.length > 0 && (
        <Flex gap="1rem" padding="1rem">
          <IconButton
            onClick={() => {
              console.log(123131);
              toast({
                title: t('Info'),
                description: t('Feat__Developing'),
                status: 'info',
                position: isLargerThanHD ? 'top-right' : 'bottom',
                duration: 1000,
              });

              // const input = uploadImageRef.current;
              // console.log(input);
              // if (input) {
              //   input.click();
              // }
            }}
            size="lg"
            aria-label="add images"
            padding=".5rem"
            icon={<MdLibraryAdd size="lg" />}
          />
          <Flex
            width="calc(100% - 48px)"
            margin="auto"
            overflow="auto"
            gap="1rem"
            flex="1"
            flexWrap={'nowrap'}
            justifyContent="flex-start"
          >
            {previewImages.map((image) => (
              <Box rounded="lg" position={'relative'} minWidth="48px">
                <IconButton
                  size="xs"
                  aria-label="remove image"
                  position="absolute"
                  right="0"
                  margin="-.5rem"
                  bg="black"
                  rounded="full"
                  variant={'solid'}
                  icon={<FaTimes fill="gray" />}
                  onClick={() => {
                    setImages(
                      images?.filter((i) => i.name !== image.name) || []
                    );
                  }}
                />
                <Image
                  src={image.url}
                  width="48px"
                  height="48px"
                  rounded="lg"
                />
              </Box>
            ))}
          </Flex>
        </Flex>
      )}
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
              placeholder={lan === 'en' ? 'Type a message' : 'Nhập tin nhắn'}
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
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                if (e.code === 'Enter') {
                  setEnterPress(true);
                  e.preventDefault();
                }
                if (e.code === 'AltLeft') {
                  setAltPress(true);
                }
              }}
              onKeyUp={(e: React.KeyboardEvent<HTMLDivElement>) => {
                if (e.code === 'AltLeft') {
                  setAltPress(false);
                }
                if (e.code === 'Enter') {
                  setEnterPress(false);
                }
              }}
            />
          ) : (
            // <Input
            //   variant={'unstyled'}
            //   value={content}
            //   placeholder="Flushed"
            //   size="md"
            //   width="100%"
            //   height="100%"
            //   paddingX={{
            //     base: '0rem',
            //     lg: '1rem',
            //   }}
            //   onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            //     if (e.key === 'Enter') {
            //       sendMessage();
            //     }
            //   }}
            //   onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            //     setContent(event.target.value);
            //   }}
            // />
            <></>
          )}
        </Flex>

        {!isLargerThanHD ? (
          content ? (
            <IconButton
              alignSelf={'flex-end'}
              size="sm"
              onClick={sendMessage}
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
        ) : content || (images && images.length > 0) ? (
          <IconButton
            alignSelf={'flex-end'}
            onClick={sendMessage}
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
