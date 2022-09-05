import { SearchIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useCheckboxGroup,
  useToast,
} from '@chakra-ui/react';
import React, { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { addConversation } from '~/app/slices/conversations.slice';
import NewGroup from '~/components/NewGroup';
import Contact from '~/components/NewGroup/Contact';
import IFriendShip from '~/interfaces/IFriendShip';
import ConversationsApi from '~/services/apis/Conversations.api';

type Props = {
  setShow: () => void;
};

export default function CreateGroupModal({ setShow }: Props) {
  const { t } = useTranslation();
  const [groupName, setGroupName] = useState('');
  const { value, getCheckboxProps } = useCheckboxGroup();
  const friendShips = useAppSelector((state) => state.friendsSlice.friendShips);
  const [friendList, setFriendsList] = useState<IFriendShip[]>(friendShips);
  const toast = useToast();
  const myId = useAppSelector((state) => state.userSlice.info._id);
  const dispatch = useAppDispatch();
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length === 0) {
      setFriendsList(friendShips);
    } else {
      const friendList = friendShips.filter((friend) =>
        friend.user.name.toLowerCase().includes(value)
      );
      console.log(friendList);
      setFriendsList([...friendList]);
    }
  };

  const handleCreateGroup = () => {
    const participants = [...value];
    participants.push(myId);
    ConversationsApi.createGroupConversation(
      groupName,
      participants as string[]
    )
      .then((res) => {
        console.log(res);
        dispatch(addConversation(res.data.data));
        toast({
          title: t('Success'),
          description: t('Create__Group__Success'),
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
      })
      .catch((error) => {
        toast({
          title: t('Faild'),
          description: t('Create__Group__Fail'),
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
      });
  };
  return (
    <Modal onClose={setShow} size={'sm'} isOpen={true}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{groupName || t('New__Group')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody padding="0">
          <Flex padding="1rem" gap="1rem" height="10%">
            <Avatar />
            <Flex width="80%">
              <Input
                placeholder={t('Set__Group__Name')}
                variant={'flushed'}
                value={groupName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setGroupName(e.target.value)
                }
              />
            </Flex>
          </Flex>
          <Flex
            alignItems={'center'}
            marginX="1rem"
            paddingX="1rem"
            rounded="lg"
            bg="gray.200"
            _dark={{
              bg: 'gray.600',
            }}
          >
            <SearchIcon fontSize={'18px'} />
            <Input
              border="none"
              variant={'unstyled'}
              outline="none"
              padding=".2rem 1rem"
              onChange={handleSearch}
            />
          </Flex>
          <CheckboxGroup value={value}>
            {friendList.map(
              (fri) =>
                fri.statusCode.code === 'a' && (
                  <Flex padding="1rem">
                    <Contact
                      avatarUrl={fri.user.avatarUrl}
                      name={fri.user.name}
                    />
                    <Checkbox
                      {...getCheckboxProps({ value: fri.user._id })}
                      marginLeft="auto"
                    ></Checkbox>
                  </Flex>
                )
            )}
          </CheckboxGroup>
        </ModalBody>
        <ModalFooter gap="1rem">
          <Button onClick={setShow}>{t('Cancel')}</Button>
          {
            <Button
              disabled={
                groupName.length >= 2 && value.length >= 2 ? false : true
              }
              bg="blue.100"
              onClick={handleCreateGroup}
              _hover={{
                bg: 'blue.300',
              }}
            >
              {t('Create__New__Group')}
            </Button>
          }
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
