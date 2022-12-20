import {
  Avatar,
  Box,
  Flex,
  Image,
  Text,
  useColorMode,
  useDisclosure,
} from '@chakra-ui/react';
import moment from 'moment';
import React, { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { IMessage } from '~/interfaces/IMessage';
import { renderAvatar } from '~/utils/renderAvatar';
import { showStatus } from './Message';
import { SERVER_URL } from '~/configs';
import OptionsMenu from './Message/OptionsMenu';
import RecallMessage from './Message/RecallMessage';
import ViewImages from './ViewImages';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { getMessageTypeImage } from '~/app/slices/messages.slice';
type Props = {
  messages: IMessage[];
  isLast?: boolean;
  other?: boolean;
};

export default function MessageImage({ isLast, messages, other }: Props) {
  const { t } = useTranslation();
  const [showOptionsMenu, setShowOptionsMenu] = React.useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [imagesClicked, setImagesClicked] = React.useState<string>('');
  const messagesImages = useAppSelector(
    (state) => state.messageSlice.messagesImages
  );
  const choosendConversation = useAppSelector(
    (state) => state.globalSlice.conversation.choosenConversationID
  );
  const dispatch = useAppDispatch();
  const handleMouseOver = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setShowOptionsMenu(true);
  };
  // on mouse up
  const handleMouseOut = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setShowOptionsMenu(false);
  };
  const handleOnClick = (imagesClicked?: string) => {
    if (!messagesImages[choosendConversation]) {
      dispatch(getMessageTypeImage(choosendConversation));
    }
    setImagesClicked(imagesClicked || '');
    onOpen();
  };
  return (
    <Flex
      width="100%"
      justifyContent={'flex-end'}
      marginRight={!other && !isLast ? '1rem' : '0'}
      marginLeft={other && !isLast ? '1rem' : '0'}
      flexDirection={other ? 'row-reverse' : 'row'}
      role="group"
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      alignItems={'center'}
    >
      {isOpen && (
        <ViewImages
          isOpen={isOpen}
          onClose={onClose}
          imagesClicked={imagesClicked}
        />
      )}

      {showOptionsMenu && messages.length === 1 && (
        <OptionsMenu
          messageId={messages[0]._id}
          time={+(messages[0].createdAt || 0)}
          isRecall={messages[0].isRecall}
          other={other}
        />
      )}
      <Box>
        {messages[0].isRecall ? (
          <RecallMessage
            isLast={isLast}
            other={other}
            isRecall={messages[0].isRecall}
          />
        ) : (
          messages.length === 1 && (
            <Box
              position={'relative'}
              role="group"
              cursor={'pointer'}
              onClick={() => {
                handleOnClick(messages[0]._id);
              }}
            >
              <Image
                fallbackSrc="https://via.placeholder.com/270x370"
                loading="lazy"
                marginRight={0}
                minWidth={'270.1px'}
                height={'370px'}
                key={messages[0]._id}
                src={renderAvatar(messages[0].content)}
                rounded="lg"
              />
              <Box
                position={'absolute'}
                top="0"
                left="0"
                right={0}
                bottom={0}
                width="100%"
                height="100%"
                bgColor={'black'}
                opacity={0}
                _groupHover={{
                  opacity: 0.5,
                }}
              ></Box>
            </Box>
          )
        )}
        {messages.length > 1 && messages.length <= 2 && (
          <Flex width={'400px'} gap=".5rem" justifyContent={'right'}>
            {messages.map((message, index) => (
              <Box
                key={message._id}
                position={'relative'}
                role="group"
                cursor={'pointer'}
                _hover={{
                  '&>div': {
                    opacity: 0.5,
                  },
                }}
                onClick={() => {
                  handleOnClick(message._id);
                }}
              >
                <Image
                  loading="lazy"
                  border={'0.5px solid white'}
                  maxWidth={'50%'}
                  fallbackSrc="https://via.placeholder.com/182x250"
                  width="182.5px"
                  height={'250px'}
                  key={message._id}
                  src={renderAvatar(message.content)}
                  rounded="lg"
                />
                <Box
                  position={'absolute'}
                  top="0"
                  left="0"
                  right={0}
                  bottom={0}
                  width="100%"
                  height="100%"
                  bgColor={'black'}
                  opacity={0}
                ></Box>
              </Box>
            ))}
          </Flex>
        )}
        {messages.length > 2 && (
          <Flex
            flexWrap={'wrap'}
            gap="0.5rem"
            width="400px"
            justifyContent={'flex-end'}
          >
            {messages.map((message, index) => (
              <Box
                key={message._id}
                position={'relative'}
                width={index > 0 && index % 3 === 0 ? '100%' : '32%'}
                height={'170px'}
                cursor={'pointer'}
                _hover={{
                  '&>div': {
                    opacity: 0.5,
                  },
                }}
                onClick={() => {
                  handleOnClick(message._id);
                }}
              >
                <Image
                  loading="lazy"
                  border={'0.5px solid white'}
                  fallbackSrc={`https://via.placeholder.com/${
                    index > 0 && index % 3 === 0 ? '100%' : '32%'
                  }x170`}
                  width="100%"
                  height="100%"
                  src={renderAvatar(message.content)}
                  rounded="lg"
                />
                <Box
                  position={'absolute'}
                  top="0"
                  left="0"
                  right={0}
                  bottom={0}
                  width="100%"
                  height="100%"
                  bgColor={'black'}
                  opacity={0}
                ></Box>
              </Box>
            ))}
          </Flex>
        )}
        {isLast && (
          <Flex gap="1rem" paddingX=".5rem">
            <Text
              color="gray.400"
              textAlign={other ? 'right' : 'left'}
              fontSize="xs"
            >
              {moment(+(messages[0].createdAt || 0)).format('HH:mm')}
            </Text>
            {!other && messages[messages.length - 1].status ? (
              <Text color="gray.400" marginLeft={'auto'} fontSize="xs">
                {t(showStatus(messages[messages.length - 1].status))}
              </Text>
            ) : (
              <></>
            )}
          </Flex>
        )}
      </Box>
      {isLast && (
        <Avatar
          src={renderAvatar(messages[0].sender.avatarUrl)}
          size="2xs"
          alignSelf={'flex-end'}
        />
      )}
    </Flex>
  );
}
