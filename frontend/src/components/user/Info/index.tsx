import React, { MouseEvent, useState } from 'react';
import {
  AvatarBadge,
  AvatarGroup,
  Box,
  Button,
  HStack,
  IconButton,
  Radio,
  RadioGroup,
  StackDivider,
  VStack,
} from '@chakra-ui/react';
import {
  Avatar,
  Flex,
  Text,
  InputGroup,
  Input,
  InputRightAddon,
} from '@chakra-ui/react';
import { AiFillCamera, AiOutlineEdit } from 'react-icons/ai';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import vi from 'date-fns/locale/vi';
import { useAppSelector } from '~/app/hooks';
import { BsCheckLg } from 'react-icons/bs';
import { FaTimes } from 'react-icons/fa';
import { useColorMode } from '@chakra-ui/react';
import { IUser } from '../../../interfaces/IUser';
type Props = {
  user: IUser;
  id?: string;
};

export default function Info({ user, id }: Props) {
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { colorMode } = useColorMode();
  const handleChangeDate = (e: Date) => {
    setDate(e);
    setShowDatePicker(!showDatePicker);
  };
  const [isEnalbeInput, setIsEnabledInput] = useState(false);
  const lan = useAppSelector((state) => state.globalSlice.lan);
  const { t } = useTranslation();
  const myId = useAppSelector((state) => state.userSlice.info._id);
  const handleEnalbeInput = () => {
    const inputArray = document.querySelectorAll('.input__info');

    if (!isEnalbeInput) {
      inputArray.forEach((value) => {
        (value as HTMLInputElement | HTMLButtonElement).removeAttribute(
          'disabled'
        );
      });
      setIsEnabledInput(true);
    } else {
      inputArray.forEach((value) => {
        (value as HTMLInputElement | HTMLButtonElement).setAttribute(
          'disabled',
          'true'
        );
      });
      setIsEnabledInput(false);
    }
  };
  return (
    <Box>
      <Flex
        justifyContent={'center'}
        alignItems="center"
        direction={'column'}
        gap="5px"
      >
        {user._id === myId ? (
          <button>
            <Avatar width="72px" height="72px" src={user.avatarUrl}>
              <AvatarBadge
                borderColor="papayawhip"
                bg="gray"
                boxSize="1.25em"
                children={<AiFillCamera color="#f5f5f5" />}
              />
            </Avatar>
          </button>
        ) : (
          <Avatar width="72px" height="72px" src={user.avatarUrl}></Avatar>
        )}
        <Input
          className="input__info"
          id="changeName"
          disabled
          _disabled={{
            color: colorMode === 'light' ? 'black' : 'white',
          }}
          textAlign={'center'}
          value={user.name}
          variant="unstyled"
          border={'none'}
        />

        <Text fontSize={'12px'}>@{user.username}</Text>
      </Flex>
      <VStack spacing="3" divider={<StackDivider />}>
        <Flex alignItems="center" height="fit-content" width="100%" gap="1rem">
          <Text fontWeight={700} minWidth="80px">
            {t('Gender')}
          </Text>
          <RadioGroup
            isDisabled={!isEnalbeInput}
            value={
              user.gender === null ? '3' : user.gender === true ? '1' : '2'
            }
            onChange={() => {}}
          >
            <HStack gap="1rem">
              <Radio value="1">{t('Male')}</Radio>
              <Radio value="2">{t('Female')}</Radio>
              <Radio value="3">{t('Other')}</Radio>
            </HStack>
          </RadioGroup>
        </Flex>
        <Flex alignItems="center" height="fit-content" width="100%" gap="1rem">
          <Text fontWeight={700} minWidth="80px">
            {t('DOB')}
          </Text>
          <Button
            bg="none"
            _hover={{
              bg: 'none',
            }}
            _active={{
              bg: 'none',
            }}
            _disabled={{
              color: colorMode === 'light' ? 'black' : 'white',
            }}
            position="relative"
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              if (isEnalbeInput) setShowDatePicker(!showDatePicker);
            }}
          >
            {user.birthday &&
              (() => {
                const birthday = user.birthday;
                const state = {
                  info: {
                    birthday: {
                      day: 0,
                      month: 0,
                      year: 0,
                    },
                  },
                };
                if (birthday.includes('-')) {
                  state.info.birthday = {
                    day: +birthday.split('-')[0],
                    month: +birthday.split('-')[1],
                    year: +birthday.split('-')[2],
                  };
                } else if (birthday.includes('/')) {
                  state.info.birthday = {
                    day: +birthday.split('/')[0],
                    month: +birthday.split('/')[1],
                    year: +birthday.split('/')[2],
                  };
                } else if (birthday.includes('.')) {
                  state.info.birthday = {
                    day: +birthday.split('.')[0],
                    month: +birthday.split('.')[1],
                    year: +birthday.split('.')[2],
                  };
                }
                return new Date(
                  state.info.birthday.year,
                  state.info.birthday.month - 1,
                  state.info.birthday.day
                ).toLocaleDateString('vi-VI');
              })()}
            {isEnalbeInput && showDatePicker && (
              <Box
                position={'absolute'}
                zIndex="50"
                top="50%"
                left="50%"
                transform="translate(-25%, 10%)"
              >
                <DatePicker
                  inline
                  selected={date}
                  onChange={handleChangeDate}
                  locale={lan === 'vn' ? vi : ''}
                  dateFormat="dd/MM/yyyy"
                />
              </Box>
            )}
          </Button>
        </Flex>
        <Flex alignItems="center" height="fit-content" width="100%" gap="1rem">
          <Text fontWeight={700} minWidth="80px">
            {t('Email')}
          </Text>
          <Input
            className="input__info"
            value={user.email}
            disabled
            _disabled={{
              color: colorMode === 'light' ? 'black' : 'white',
            }}
            outline="none"
            border={'none'}
            variant="unstyled"
          />
        </Flex>
        <Flex alignItems="center" height="fit-content" width="100%" gap="1rem">
          <Text fontWeight={700} minWidth="120px">
            {t('Phone')}
          </Text>
          <Input
            className="input__info"
            value={user.phone}
            disabled
            _disabled={{
              color: colorMode === 'light' ? 'black' : 'white',
            }}
            outline="none"
            border={'none'}
            variant="unstyled"
          />
        </Flex>
      </VStack>
      {user._id === myId ? (
        !isEnalbeInput ? (
          <IconButton
            display="flex"
            width="90%"
            marginY="10px"
            marginX="auto"
            aria-label="edit info"
            gap="1rem"
            onClick={() => handleEnalbeInput()}
            icon={
              <>
                <AiOutlineEdit size="24px" />
                <Text fontSize={'12px'}>{t('Edit')}</Text>
              </>
            }
          />
        ) : (
          <Flex justifyContent="space-around" marginY="1rem">
            <IconButton
              aria-label="Accept"
              padding="1rem"
              icon={
                <Flex alignItems="center" justifyContent={'center'} gap="1rem">
                  <BsCheckLg size="24px" color="green" />
                  {t('Accept')}
                </Flex>
              }
            />
            <IconButton
              aria-label="Decline"
              padding="1rem"
              onClick={() => {
                handleEnalbeInput();
              }}
              icon={
                <Flex alignItems="center" justifyContent={'center'} gap="1rem">
                  <FaTimes size="24px" color="red" />
                  {t('Decline')}
                </Flex>
              }
            />
          </Flex>
        )
      ) : (
        ''
      )}
    </Box>
  );
}
