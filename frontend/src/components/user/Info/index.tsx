import React, { useState } from 'react';
import {
  AvatarBadge,
  AvatarGroup,
  Box,
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
type Props = {};

export default function Info({}: Props) {
  const handleChangeDate = (e: Date) => {
    console.log(e);
  };
  const [isEnalbeInput, setIsEnabledInput] = useState(false);
  const lan = useAppSelector((state) => state.globalSlice.lan);
  const { t } = useTranslation();
  const handleEnalbeInput = () => {
    const inputArray = document.querySelectorAll('.input__info');

    if (!isEnalbeInput) {
      inputArray.forEach((value) => {
        (value as HTMLInputElement).disabled = false;
      });
      setIsEnabledInput(true);
    } else {
      inputArray.forEach((value) => {
        (value as HTMLInputElement).disabled = true;
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
        <button>
          <Avatar width="72px" height="72px" src="https://picsum.photos/200">
            <AvatarBadge
              borderColor="papayawhip"
              bg="gray"
              boxSize="1.25em"
              children={<AiFillCamera color="#f5f5f5" />}
            />
          </Avatar>
        </button>
        <Input
          className="input__info"
          id="changeName"
          disabled
          _disabled={{
            color: 'black',
          }}
          textAlign={'center'}
          value={'Tran cao Phuoc Long'}
          variant="unstyled"
          border={'none'}
        />

        <Text fontSize={'12px'}>@Ai_cung_co</Text>
      </Flex>
      <VStack spacing="3" divider={<StackDivider />}>
        <Flex alignItems="center" height="fit-content" width="100%" gap="1rem">
          <Text fontWeight={700} minWidth="80px">
            {t('Gender')}
          </Text>
          <RadioGroup value={'1'} onChange={() => {}}>
            <HStack gap="1rem">
              <Radio value="1">{t('Male')}</Radio>
              <Radio value="2">{t('Female')}</Radio>
            </HStack>
          </RadioGroup>
        </Flex>
        <Flex alignItems="center" height="fit-content" width="100%" gap="1rem">
          <Text fontWeight={700} minWidth="80px">
            {t('DOB')}
          </Text>
          <input
            type="date"
            name="begin"
            placeholder="dd-mm-yyyy"
            value=""
            min="1997-01-01"
            max="2030-12-31"
          />
        </Flex>
        <Flex alignItems="center" height="fit-content" width="100%" gap="1rem">
          <Text fontWeight={700} minWidth="80px">
            {t('Email')}
          </Text>
          <Input
            className="input__info"
            value={'caophuoclong@gmail.com'}
            disabled
            _disabled={{
              color: 'black',
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
            value={'+84 326 031 442'}
            disabled
            _disabled={{
              color: 'black',
            }}
            outline="none"
            border={'none'}
            variant="unstyled"
          />
        </Flex>
      </VStack>
      {!isEnalbeInput ? (
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
              <Flex alignItems="center" justifyContent={'center'}>
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
              <Flex alignItems="center" justifyContent={'center'}>
                <FaTimes size="24px" color="red" />
                {t('Decline')}
              </Flex>
            }
          />
        </Flex>
      )}
    </Box>
  );
}
