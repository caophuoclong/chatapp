import React from 'react';
import {
  Avatar,
  AvatarBadge,
  Box,
  Flex,
  HStack,
  IconButton,
  StackDivider,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ArrowBackIcon, Search2Icon } from '@chakra-ui/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BsBellFill, BsBellSlashFill } from 'react-icons/bs';
import { useColorMode } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import Desktop from './Desktop';
import { AvatarConversation } from '~/components/Conversations/Conversation/AvatarConversation';
import Mobile from './Mobile';
import { setShowInfoConversation } from '~/app/slices/global.slice';
type Props = {};

export default function InfoConversation({}: Props) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();
  const { colorMode } = useColorMode();
  const isLargerThanHD = useAppSelector(
    (state) => state.globalSlice.isLargerThanHD
  );
  const choosenConversationID = useAppSelector(
    (state) => state.globalSlice.conversation.choosenConversationID
  );
  const conversations = useAppSelector(
    (state) => state.conversationsSlice.conversations
  );
  const conversation = conversations.find(
    (conversation) => conversation._id === choosenConversationID
  );
  const dispatch = useAppDispatch();
  const onHideInfoConversation = () => {
    dispatch(setShowInfoConversation(false));
  };
  return (
    <Box
      width={{
        base: '100%',
      }}
      minHeight="60%"
      maxHeight="90%"
      boxSizing="border-box"
    >
      {conversation ? (
        isLargerThanHD ? (
          <Desktop conversation={conversation}></Desktop>
        ) : (
          <Mobile
            conversation={conversation}
            onHideInfoConversation={onHideInfoConversation}
          ></Mobile>
        )
      ) : null}
    </Box>
  );
}
