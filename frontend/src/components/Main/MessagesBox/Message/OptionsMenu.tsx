import { Box, Flex, IconButton } from '@chakra-ui/react';
import { BsShareFill, BsReplyFill } from 'react-icons/bs';
import { MdOutlineLoop } from 'react-icons/md';
import React from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { recallMessage } from '~/app/slices/messages.slice';
import { updateConversation } from '~/app/slices/conversations.slice';
import { SocketEvent } from '~/constants/socketEvent';
import MessagesApi from '../../../../services/apis/Messages.api';

type Props = {
  messageId: string;
  time: number;
  isRecall: boolean;
  other?: boolean;
};

export default function OptionsMenu({
  messageId,
  time,
  isRecall,
  other,
}: Props) {
  const { t } = useTranslation();
  const socket = useAppSelector((state) => state.globalSlice.socket);

  const distance = new Date().getTime() - +time;
  const conversationId = useAppSelector(
    (state) => state.globalSlice.conversation.choosenConversationID
  );
  const dispatch = useAppDispatch();
  const onRecallClick = async () => {
    try {
      await MessagesApi.recallMessage(messageId);
      dispatch(
        recallMessage({
          conversationId: conversationId,
          messageId: messageId,
        })
      );
      const updateAt = Date.now();
      dispatch(
        updateConversation({
          conversationId,
          conversation: {
            updateAt,
          },
        })
      );
    } catch (error) {}
  };
  return (
    <Flex
      bg="gray.300"
      display={'none'}
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
      {distance <= 3600000 && !isRecall && !other && (
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
