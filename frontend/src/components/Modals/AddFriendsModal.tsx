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
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FriendsApi from '~/services/apis/Friends.api';
import FoundUser from '../Modals/FoundUser';
import { IUser } from '~/interfaces/IUser';
import { status } from '../../interfaces/IFriendShip';
import { useAppSelector } from '~/app/hooks';
import { useForm } from 'react-hook-form';
import IFriendShip from '../../interfaces/IFriendShip';

type Props = {
  setShow: () => void;
};

export default function AddFriendsModal({ setShow }: Props) {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [foundUsers, setFoundUsers] = useState<IUser | null>();
  const friendShips = useAppSelector((state) => state.friendsSlice.friendShips);
  console.log(friendShips);
  const [friendShip, setFriendShip] = useState<IFriendShip>();
  const toast = useToast();
  const { handleSubmit, register, watch } = useForm({
    defaultValues: {
      username: '',
    },
  });
  const x = watch('username');
  console.log(x);
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = handleSubmit(async (data) => {
    const { username } = data;
    if (username.length > 0) {
      const fr = friendShips.find((fr) => fr.user.username === username);
      if (fr) {
        setFoundUsers(fr.user);
        setFriendShip(fr);
      } else {
        try {
          const response = await FriendsApi.getUserByUsername(username);
          console.log(response);
          if (response.data.status === 404) {
            toast({
              title: t('Error'),
              description: t('User__Not__Found'),
              status: 'error',
              duration: 3000,
              position: 'top-right',
            });
            setFoundUsers(null);
          } else {
            const data = response.data;
            const user = data.user as IUser;
            setUsername(user.username);
            setFoundUsers(user);
          }
        } catch (error) {
          // console.log(error);
        }
      }
    }
  });
  useEffect(() => {
    setFriendShip(friendShips.find((fr) => fr.user.username === x));
  }, [friendShips]);
  console.log(friendShip);
  const handleEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // console.log(e);
  };
  return (
    <Modal onClose={setShow} size={'sm'} isOpen={true}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={onSubmit} ref={formRef}>
          <ModalHeader>{t('AddFriend')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody padding="0">
            <Flex direction={'column'}>
              <Flex boxSizing="border-box" paddingX=".5rem">
                {/* <label htmlFor="">{t('Username')}</label> */}
                <Input
                  placeholder={t('Username')}
                  variant={'flushed'}
                  onKeyDown={handleEnterPress}
                  {...register('username')}
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
                    friendShipstatus={friendShip ? friendShip.status : null}
                    friendShipId={friendShip ? friendShip._id : ''}
                    flag={friendShip ? friendShip.flag : ''}
                  />
                )}
              </Box>
            </Flex>
          </ModalBody>
          <ModalFooter gap="1rem">
            <Button onClick={setShow}>{t('Cancel')}</Button>
            <Button
              bg="blue.100"
              type="submit"
              _hover={{
                bg: 'blue.300',
              }}
            >
              {t('Search')}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
