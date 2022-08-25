import {
  Box,
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import React, { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FriendsApi from '~/services/apis/Friends.api';
import FoundUser from './FoundUser';
import { IUser } from '~/interfaces/IUser';
import { StatusCode } from '../../../interfaces/IFriendShip';

type Props = {
  setShow: () => void;
};

export default function AddFriendsModal({ setShow }: Props) {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [foundUsers, setFoundUsers] = useState<IUser>();
  const [friendShipStatus, setFriendShipStatus] = useState<StatusCode | null>(
    null
  );
  const [friendShipId, setFriendShipId] = useState('');
  const [flag, setFlag] = useState<'sender' | 'target' | ''>('');
  const toast = useToast();
  const handleSearch = async () => {
    try {
      const response = await FriendsApi.getUserByUsername(username);
      console.log(response);
      const data = response.data.data;
      const user = data.user as IUser;
      setFriendShipStatus(data.friendShip as StatusCode | null);
      setFlag(data.flag);
      setFriendShipId(data.friendShipId);
      setFoundUsers(user);
      if (!user) {
        toast({
          title: t('UserNotFound'),
          description: t('UserNotFoundDescription'),
          status: 'error',
          duration: 3000,
          position: 'top-right',
        });
      }
    } catch (error) {
      // console.log(error);
    }
  };
  return (
    <Modal onClose={setShow} size={'sm'} isOpen={true}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('AddFriend')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody padding="0">
          <Flex direction={'column'}>
            <Flex boxSizing="border-box" paddingX=".5rem">
              {/* <label htmlFor="">{t('Username')}</label> */}
              <Input
                placeholder={t('Username')}
                variant={'flushed'}
                value={username}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setUsername(e.target.value);
                }}
              />
            </Flex>
            <Box
              marginY="1rem"
              boxSizing="border-box"
              overflow={'auto'}
              maxHeight="700px"
            >
              {foundUsers && (
                <FoundUser
                  user={foundUsers}
                  friendShipStatusCode={friendShipStatus}
                  setFrienShipStatus={(s: StatusCode | null) =>
                    setFriendShipStatus(s)
                  }
                  friendShipId={friendShipId}
                  flag={flag}
                />
              )}
            </Box>
          </Flex>
        </ModalBody>
        <ModalFooter gap="1rem">
          <Button onClick={setShow}>{t('Cancel')}</Button>
          <Button
            bg="blue.100"
            onClick={handleSearch}
            _hover={{
              bg: 'blue.300',
            }}
          >
            {t('Search')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
