import { SearchIcon } from '@chakra-ui/icons';
import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
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
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoCamera, IoCameraOutline, IoCameraSharp } from 'react-icons/io5';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { addConversation } from '~/app/slices/conversations.slice';
import NewGroup from '~/components/NewGroup';
import Contact from '~/components/NewGroup/Contact';
import { SERVER_URL } from '~/configs';
import IFriendShip from '~/interfaces/IFriendShip';
import ConversationsApi from '~/services/apis/Conversations.api';
import readFile from '~/utils/readFile';
import { renderAvatar } from '~/utils/renderAvatar';

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
    const data = new FormData();
    data.append('name', groupName);
    data.append('participants', JSON.stringify(participants));
    if (file) data.append('file', file);
    data.append('visible', 'false');
    ConversationsApi.createGroupConversation(data)
      .then((res) => {
        console.log(res);
        dispatch(addConversation(res.data));
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
  const [file, setFile] = useState<File | null>();
  const [previewAvatar, setPreviewAvatar] = useState<string>('');
  useEffect(() => {
    (async () => {
      if (file) {
        try {
          const preview = await readFile(file);
          setPreviewAvatar(preview);
        } catch (error) {
          console.log(error);
        }
      }
    })();
  }, [file]);
  const removeAvatar = () => {
    setFile(null);
    setPreviewAvatar('');
  };
  return (
    <Modal onClose={setShow} size={'sm'} isOpen={true}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{groupName || t('New__Group')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody padding="0">
          <Flex padding="1rem" gap="1rem" height="10%">
            {previewAvatar ? (
              <Menu>
                {() => (
                  <>
                    <MenuButton>
                      <Avatar src={previewAvatar} size="md" />
                    </MenuButton>
                    <MenuList>
                      <MenuItem>
                        <label
                          htmlFor="conversationAvatarUpload"
                          style={{
                            cursor: 'pointer',
                          }}
                        >
                          {t('Change__Avatar')}
                        </label>
                      </MenuItem>
                      <MenuItem onClick={() => removeAvatar()}>
                        {t('Remove__Avatar')}
                      </MenuItem>
                    </MenuList>
                  </>
                )}
              </Menu>
            ) : (
              <label
                htmlFor="conversationAvatarUpload"
                style={{ cursor: 'pointer' }}
              >
                <Flex
                  width={'48px'}
                  height={'48px'}
                  rounded="full"
                  border="1px solid black"
                  justifyContent={'center'}
                  alignItems="center"
                >
                  <IoCamera size="40px" fill="gray.700" />
                </Flex>
              </label>
            )}
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
            <input
              id="conversationAvatarUpload"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files) setFile(e.target.files[0]);
              }}
              type="file"
              accept=""
              hidden
            />
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
                fri.status.code === 'a' && (
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
