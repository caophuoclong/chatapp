import { Box, Flex, IconButton } from '@chakra-ui/react';
import { BsShareFill, BsReplyFill } from 'react-icons/bs';
import { MdOutlineLoop } from 'react-icons/md';
import React from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { recallMessage } from '~/app/slices/messages.slice';
import { AppSocket } from '~/class/AppSocket';

type Props = {
  messageId: string;
  time: string;
};

export default function OptionsMenu({ messageId, time }: Props) {
  const { t } = useTranslation();
  const socket = AppSocket.getInstance();

  const distance = new Date().getTime() - +time;
  const conversationId = useAppSelector(
    (state) => state.globalSlice.conversation.choosenConversationID
  );
  const dispatch = useAppDispatch();
  const onRecallClick = () => {
    dispatch(
      recallMessage({
        conversationId: conversationId,
        messageId: messageId,
      })
    );
    socket.emit('recallMessage', { conversationId, messageId });
  };
  return (
    <Flex
      bg="gray.300"
      display={'none'}
      marginTop="-1rem"
      marginRight="1rem"
      height="30"
      rounded={'xl'}
      alignItems="center"
      paddingX=".2rem"
      _groupHover={{
        display: 'flex',
      }}
    >
      <IconButton
        variant="none"
        aria-label="Share"
        icon={<BsShareFill size="16px" />}
        title={t('Share')}
      />
      <IconButton
        variant="none"
        aria-label="Reply"
        icon={<BsReplyFill size="24px" />}
        title={t('Reply')}
      />
      {distance <= 3600000 && (
        <IconButton
          onClick={onRecallClick}
          variant="none"
          color={'red.500'}
          aria-label="Recall"
          title={t('Recall__Message')}
          icon={<MdOutlineLoop size="24px" />}
        />
      )}
    </Flex>
  );
}
