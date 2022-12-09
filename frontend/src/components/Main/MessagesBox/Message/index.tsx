import { Avatar, Box, Flex, Text, useColorMode } from '@chakra-ui/react';
import { TFunction } from 'i18next';
import React, { MouseEvent, MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import { BsCheckLg } from 'react-icons/bs';
import { useAppSelector } from '~/app/hooks';
import {
  IMessage,
  MessageStatusType,
  MessageType,
} from '~/interfaces/IMessage';
import { IUser } from '~/interfaces/IUser';
import moment from 'moment';
import OptionsMenu from './OptionsMenu';
import { renderAvatar } from '../../../../utils/renderAvatar';

type Props = {
  content: React.ReactNode;
  other?: boolean;
  time: number;
  _id: string;
  type: MessageType;
  isRecall: boolean;
  isLast: boolean;
  sender: IUser;
  status?: MessageStatusType;
};
const square = '16px';

function ShowStatus(
  lastMessageId: string,
  messages: IMessage[],
  t: TFunction,
  friend?: IUser
) {
  const message = messages.filter(
    (message) => message._id === lastMessageId
  )[0];
  // const message = {
  //   status: MessageStatusType.SEEN,
  // };
  switch (message.status) {
    case MessageStatusType.SENT:
      return (
        <Flex
          border="2px solid"
          borderColor={'blue.300'}
          width={square}
          height={square}
          rounded="full"
          justifyContent={'center'}
          alignItems="center"
        >
          <BsCheckLg size="8px" />
        </Flex>
      );
    case MessageStatusType.RECEIVED:
      return (
        <Flex
          border="2px solid"
          borderColor={'blue.300'}
          width={square}
          height={square}
          rounded="full"
          bg="blue.300"
          justifyContent={'center'}
          alignItems="center"
        >
          <BsCheckLg size="8px" />
        </Flex>
      );
    case MessageStatusType.SEEN:
      return (
        // <Flex
        //   border="2px solid"
        //   borderColor={'blue.300'}
        //   width={square}
        //   height={square}
        //   rounded="full"
        //   bg="blue.300"
        //   justifyContent={'center'}
        //   alignItems="center"
        // >
        <img
          src={`${process.env.REACT_APP_SERVER_URL}/images/${friend?.avatarUrl}`}
          alt={friend?.name + '__' + 'avatar'}
          style={{
            width: square,
            height: square,
            borderRadius: '100%',
          }}
        />
        // </Flex>
      );
    default:
      return (
        <Box
          border="2px solid"
          borderColor={'blue.300'}
          width={square}
          height={square}
          rounded="full"
        >
          {' '}
        </Box>
      );
  }
}
export function showStatus(status: MessageStatusType) {
  switch (status) {
    case MessageStatusType.SENT:
      return 'SENT';
    case MessageStatusType.RECEIVED:
      return 'RECEIVED';
    case MessageStatusType.SEEN:
      return 'SEEN';
    default:
      return 'SENDING';
  }
}

export default function Message({
  isRecall,
  type,
  content,
  other,
  isLast,
  _id,
  time,
  sender,
  status,
}: Props) {
  const [showOptionsMenu, setShowOptionsMenu] = React.useState(false);
  // on mouse down
  const handleMouseOver = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setShowOptionsMenu(true);
  };
  // on mouse up
  const handleMouseOut = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setShowOptionsMenu(false);
  };
  const { colorMode } = useColorMode();
  const { t } = useTranslation();
  return (
    <Flex
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      role="group"
      alignItems={'center'}
      marginRight={!other && !isLast ? '1rem' : '0'}
      marginLeft={other && !isLast ? '1rem' : '0'}
      flexDirection={other ? 'row-reverse' : 'row'}
    >
      <Box
        marginRight={other ? 'none' : '1rem'}
        marginLeft={other ? '1rem' : 'none'}
      >
        {showOptionsMenu && (
          <OptionsMenu
            messageId={_id}
            time={time}
            isRecall={isRecall}
            other={other}
          />
        )}
      </Box>
      <Box
        marginRight={other ? 'none' : '.5rem'}
        marginLeft={other ? '.5rem' : 'none'}
        fontSize={'16px'}
        wordBreak="break-word"
        padding=".5rem"
        rounded="lg"
        roundedBottomRight={!other && isLast ? 'none' : 'lg'}
        roundedBottomLeft={other && isLast ? 'none' : 'lg'}
        whiteSpace={'pre-wrap'}
        color={
          isRecall ? 'gray.500' : colorMode === 'light' ? 'black' : 'white'
        }
        bg={
          type === MessageType.TEXT || isRecall
            ? colorMode === 'light'
              ? other
                ? 'gray.300'
                : 'blue.300'
              : other
              ? 'gray.700'
              : 'purple.600'
            : 'none'
        }
      >
        {isRecall ? t('This__Message__HasBeen__Recalled') : content}
        {isLast && (
          <Flex gap="1rem">
            <Text
              color="gray.400"
              textAlign={other ? 'right' : 'left'}
              fontSize="xs"
            >
              {moment(+time).format('HH:mm')}
            </Text>
            {!other && status ? (
              <Text color="gray.400" marginLeft={'auto'} fontSize="xs">
                {t(showStatus(status))}
              </Text>
            ) : (
              <></>
            )}
          </Flex>
        )}
      </Box>
      {isLast && (
        <Avatar
          src={renderAvatar(sender.avatarUrl)}
          size="2xs"
          alignSelf={'flex-end'}
        />
      )}
    </Flex>
  );
}
