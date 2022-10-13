import {
  Flex,
  HStack,
  IconButton,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Emoji } from 'emoji-picker-react';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { useColorMode } from '@chakra-ui/react';
import LoadingScreen from '~/components/LoadingScreen';
import ConversationsApi from '../../../../services/apis/Conversations.api';
import { updateEmoji } from '~/app/slices/conversations.slice';

type Props = {};

export default function CustomPickerEmoji({}: Props) {
  const emojiList = [
    {
      label: 'like',
      emoji: '1f44d',
    },
    {
      label: 'haha',
      emoji: '1f923',
    },
    {
      label: 'heart',
      emoji: '2764-fe0f',
    },
    {
      label: 'smiling',
      emoji: '1f603',
    },
    {
      label: 'heart eyes',
      emoji: '1f60d',
    },
    {
      label: 'smirk',
      emoji: '1f60f',
    },
    {
      label: 'cry',
      emoji: '1f62d',
    },
  ];
  const { colorMode } = useColorMode();
  const emojiStyle = useAppSelector((state) => state.globalSlice.emojiStyle);
  const choosenConversationId = useAppSelector(
    (state) => state.globalSlice.conversation.choosenConversationID
  );
  const conversations = useAppSelector(
    (state) => state.conversationsSlice.conversations
  );
  const conversation = conversations.find(
    (conversation) => conversation._id === choosenConversationId
  );
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const handleUpdateEmoji = async (value: string) => {
    try {
      setLoading(true);
      if (conversation) {
        const response = await ConversationsApi.updateConversationEmoji(
          choosenConversationId,
          {
            ...conversation!.emoji!,
            emoji: value,
          }
        );
        if (response.data.statusCode === 200) {
          dispatch(
            updateEmoji({
              _id: choosenConversationId,
              emoji: {
                ...conversation.emoji!,
                emoji: value,
              },
            })
          );
        }
        setLoading(false);
      }
      //   setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <Flex justifyContent={'space-evenly'}>
      {loading && <LoadingScreen />}
      {emojiList.map((item, index) => (
        <IconButton
          variant={'unstyled'}
          rounded="lg"
          _hover={{
            bg: colorMode === 'light' ? 'gray.200' : 'gray.400',
          }}
          key={index}
          width={'48px'}
          height={'48px'}
          display="flex"
          justifyContent={'center'}
          alignItems={'center'}
          aria-label={item.label}
          onClick={() => {
            handleUpdateEmoji(item.emoji);
          }}
          disabled={conversation?.emoji?.emoji === item.emoji ? true : false}
          icon={
            <Emoji unified={item.emoji} size={32} emojiStyle={emojiStyle} />
          }
        ></IconButton>
      ))}
    </Flex>
  );
}
