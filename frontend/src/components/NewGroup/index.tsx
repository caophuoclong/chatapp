import { ArrowBackIcon, SearchIcon } from '@chakra-ui/icons';
import {
  Avatar,
  AvatarBadge,
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  IconButton,
  Input,
  Text,
  useCheckboxGroup,
  useColorMode,
  useToast,
} from '@chakra-ui/react';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaCheck, FaTimes } from 'react-icons/fa';
import Contact from './Contact';
import { useAppSelector } from '../../app/hooks';
import IConversation from '~/interfaces/IConversation';
import IFriendShip from '../../interfaces/IFriendShip';
import ConversationsApi from '~/services/apis/Conversations.api';

type Props = {};

export default function NewGroup({}: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showCheck, setShowCheck] = useState(false);
  const [input, setInput] = useState('');
  const { colorMode } = useColorMode();
  const myId = useAppSelector((state) => state.userSlice.info._id);
  const friendShip = useAppSelector((state) => state.friendsSlice.friendShips);
  const [friendList, setFriendsList] = useState<IFriendShip[]>(friendShip);
  const toast = useToast();
  useEffect(() => {
    if (input.length > 3) {
      setShowCheck(true);
    } else {
      setShowCheck(false);
    }
  }, [input]);
  const { value, getCheckboxProps, setValue } = useCheckboxGroup();
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log(value);
    if (value.length === 0) {
      setFriendsList(friendShip);
    } else {
      const friendList = friendShip.filter((friend) =>
        friend.user.name.toLowerCase().includes(value)
      );
      console.log(friendList);
      setFriendsList([...friendList]);
    }
  };
  const handleRemove = (_id: string | number) => {
    setValue(value.filter((id) => id !== _id));
  };
  useEffect(() => {
    console.log(value);
  }, [value]);
  const handleCreateGroup = () => {
    const participants = [...value];
    participants.push(myId);
    ConversationsApi.createGroupConversation(input, participants as string[])
      .then((res) => {
        toast({
          title: t('Success'),
          description: t('Create__Group__Sucess'),
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((error) => {
        toast({
          title: t('Faild'),
          description: t('Create__Group__Fail'),
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };
  return (
    <Flex direction="column" height="100vh" position="relative">
      <Flex
        height="10%"
        width="100%"
        alignItems={'center'}
        padding="0.5rem 1rem"
        // bg="white"
        boxShadow="rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px"
      >
        <ArrowBackIcon
          fontSize={'1.5rem'}
          display={{
            base: 'block',
            lg: 'none',
          }}
          onClick={() => {
            navigate(-1);
          }}
        />
        <Text>{input.length === 0 ? t('New__Group') : input}</Text>
      </Flex>
      <Flex padding="1rem" gap="1rem" height="10%">
        <Avatar />
        <Flex width="80%">
          <Input
            placeholder={t('Set__Group__Name')}
            variant={'flushed'}
            value={input}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setInput(e.target.value)
            }
          />
        </Flex>
        {showCheck && (
          <Button
            padding="0"
            bg="none"
            _hover={{ bg: 'none' }}
            _active={{ bg: 'none' }}
            color="blue.300"
          >
            <FaCheck fontSize={'32px'} />
          </Button>
        )}
      </Flex>
      <Flex
        alignItems={'center'}
        marginX="1rem"
        paddingX="1rem"
        rounded="lg"
        bg="gray.200"
        _dark={{
          bg: 'gray.700',
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
      <Flex
        direction="column"
        gap="1rem"
        height="80%"
        padding="1rem"
        boxSizing="border-box"
        overflow={'auto'}
      >
        <CheckboxGroup value={value}>
          {friendList.map((fri) => (
            <Flex>
              <Contact avatarUrl={fri.user.avatarUrl} name={fri.user.name} />
              <Checkbox
                {...getCheckboxProps({ value: fri.user._id })}
                marginLeft="auto"
              ></Checkbox>
            </Flex>
          ))}
        </CheckboxGroup>
      </Flex>
      {value.length > 0 && (
        <Flex
          position={'absolute'}
          bottom="0"
          padding="1rem"
          bg="red.300"
          width="100%"
          gap="1rem"
        >
          <Flex overflow="auto" gap="1rem" width="90%">
            {value.map((v, index) => (
              <Button
                key={index}
                onClick={() => {
                  handleRemove(v);
                }}
                padding="0"
                height="48px"
                bg="none"
                _active={{
                  bg: 'none',
                }}
                _hover={{
                  bg: 'none',
                }}
                _focus={{
                  bg: 'none',
                }}
              >
                <Avatar
                  size="md"
                  position={'relative'}
                  src={
                    friendShip.filter((fri) => fri.user._id === v)[0].user
                      .avatarUrl
                  }
                >
                  <div
                    style={{
                      outline: '1px solid #fff',
                      padding: '2px',
                      borderRadius: '100%',
                      backgroundColor: '#A0AEC0',
                      position: 'absolute',
                      top: 1,
                      right: 1,
                    }}
                  >
                    <FaTimes size="12px" />
                  </div>
                </Avatar>
              </Button>
            ))}
          </Flex>
          <Button
            disabled={input.length > 3 && value.length > 2 ? false : true}
            marginLeft={'auto'}
            rounded="full"
            padding="0"
            color="blue.400"
            bg="blue.100"
            onClick={handleCreateGroup}
          >
            <FaCheck fontSize={'24px'} />
          </Button>
        </Flex>
      )}
    </Flex>
  );
}
