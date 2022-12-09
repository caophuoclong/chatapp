import { Avatar, Box, Flex, Image, Text, useColorMode } from '@chakra-ui/react';
import moment from 'moment';
import React, { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { IMessage } from '~/interfaces/IMessage';
import { renderAvatar } from '~/utils/renderAvatar';
import { showStatus } from './Message';
import { SERVER_URL } from '~/configs';
import OptionsMenu from './Message/OptionsMenu';
import RecallMessage from './Message/RecallMessage';
type Props = {
  messages: IMessage[];
  isLast?: boolean;
  other?: boolean;
};

export default function MessageImage({ isLast, messages, other }: Props) {
  const { t } = useTranslation();
  const [showOptionsMenu, setShowOptionsMenu] = React.useState(false);
  const parseUrl = (content?: string) => {
    // check if content is a url
    if (!content) return '';
    if (
      content.startsWith('http:') ||
      content.startsWith('data:image') ||
      content.startsWith('blob:')
    ) {
      return content;
    }
    return `${SERVER_URL}/images/${content}`;
  };
  const handleMouseOver = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setShowOptionsMenu(true);
  };
  // on mouse up
  const handleMouseOut = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setShowOptionsMenu(false);
  };
  return (
    <Flex
      marginRight={!other && !isLast ? '1rem' : '0'}
      marginLeft={other && !isLast ? '1rem' : '0'}
      flexDirection={other ? 'row-reverse' : 'row'}
      role="group"
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      alignItems={'center'}
    >
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
            <Image
              loading="lazy"
              marginRight={0}
              width={'270.1px'}
              height={'370px'}
              key={messages[0]._id}
              src={parseUrl(messages[0].content)}
              rounded="lg"
            />
          )
        )}
        {messages.length > 1 && messages.length <= 2 && (
          <Flex width={'400px'} gap=".5rem" justifyContent={'right'}>
            {messages.map((message, index) => (
              <Image
                loading="lazy"
                border={'0.5px solid white'}
                maxWidth={'50%'}
                width="182.5px"
                height={'250px'}
                key={message._id}
                src={parseUrl(message.content)}
                rounded="lg"
              />
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
              <Image
                loading="lazy"
                border={'0.5px solid white'}
                width={index > 0 && index % 3 === 0 ? '100%' : '32%'}
                height={'170px'}
                key={message._id}
                src={parseUrl(message.content)}
                rounded="lg"
              />
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
