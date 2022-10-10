import {
  Avatar,
  Box,
  Button,
  Flex,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { FaUserAlt } from 'react-icons/fa';
import { IUser } from '~/interfaces/IUser';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { setShowInfoConversation } from '~/app/slices/global.slice';
import { SERVER_URL } from '~/configs';
import { FiEdit3 } from 'react-icons/fi';
import EditNameGroupChat from '../../Modals/EditNameGroupChat';
import { AvatarConversation } from '~/components/Conversations/Conversation/AvatarConversation';
type Props = {
  participants: IUser[];
  name: string;
  avatarUrl: string;
  _id: string;
  owner: IUser;
};

export default function GroupHeader({
  participants,
  name,
  avatarUrl,
  _id,
  owner,
}: Props) {
  console.log(owner);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [groupName, changeGroupName] = React.useState(name);
  const me = useAppSelector((state) => state.userSlice.info);
  useEffect(() => {
    changeGroupName(name);
  }, [name]);
  const onChangeGroupName = (name: string) => {
    changeGroupName(name);
  };

  return (
    <Flex>
      {isOpen && (
        <EditNameGroupChat
          isOpen={isOpen}
          onClose={onClose}
          groupName={groupName}
          onChangeGroupName={onChangeGroupName}
          _id={_id}
        >
          <AvatarConversation
            avatarUrl={avatarUrl}
            participants={participants}
            size={80}
          />
          <Text fontSize="xl" fontWeight="bold" ml="10px"></Text>
        </EditNameGroupChat>
      )}

      <Box
        display={{
          base: 'none',
          lg: 'block',
        }}
      >
        <AvatarConversation avatarUrl={avatarUrl} participants={participants} />
      </Box>
      <Box marginX=".5rem">
        <Flex alignItems={'center'} gap=".5rem" role="group">
          <Text fontWeight={600} noOfLines={1}>
            {name}
          </Text>
          {me._id === owner._id && (
            <Button
              rounded="full"
              size="xs"
              display={'flex'}
              visibility={'hidden'}
              _groupHover={{
                visibility: 'visible',
              }}
              justifyContent={'center'}
              onClick={onOpen}
            >
              <FiEdit3 size="16px" />
            </Button>
          )}
        </Flex>

        <Flex
          justifyContent={'flex-start'}
          alignItems="center"
          fontSize={'12px'}
          gap=".5rem"
          _hover={{
            color: 'blue.500',
          }}
          userSelect="none"
          cursor={'pointer'}
          onClick={() => {
            dispatch(setShowInfoConversation(true));
          }}
        >
          <FaUserAlt />
          <Text>
            {participants.length}{' '}
            {participants.length > 1 ? t('Members') : t('Member')}
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
}
