import { EditIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  StackDivider,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import {
  regAtLeastUpper,
  regAtLeastNum,
  regAtLeastSpecial,
} from '../../../pages/SetPassword/index';
import LoadingScreen from '~/components/LoadingScreen';
import UserApi from '../../../services/apis/User.api';
type Props = {};
const randomPassword = (Math.random() + 1).toString(36);

export default function ChangePassword({}: Props) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { t } = useTranslation();
  const [sliderValue, setSliderValue] = useState(0);
  const [sliderColor, setSliderColor] = useState('red.500');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [isLoadingScreen, setIsLoadingScreen] = useState(false);
  const toast = useToast();
  const handleNewPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const atLeast4 = value.length >= 4;
    const atLeast8 = value.length >= 8;
    const atLeast12 = value.length >= 12;
    const atLeastUpper = regAtLeastUpper.test(value);
    const atLeastNum = regAtLeastNum.test(value);
    const atLeastSpecial = regAtLeastSpecial.test(value);
    let sliderValue = 0;
    if (atLeast4) {
      sliderValue += 5;
    }
    if (atLeast8) {
      sliderValue += 10;
    }
    if (atLeast12) {
      sliderValue += 10;
    }
    if (atLeastUpper) {
      sliderValue += 10;
    }
    if (atLeastNum) {
      sliderValue += 10;
    }
    if (atLeastSpecial) {
      sliderValue += 30;
    }
    // with all condition above and length larger than 20 set 100
    if (
      atLeast8 &&
      atLeast12 &&
      atLeastUpper &&
      atLeastNum &&
      atLeastSpecial &&
      value.length >= 20
    ) {
      sliderValue = 100;
    }
    setSliderValue(sliderValue);
    setNewPassword(value);
  };
  useEffect(() => {
    if (sliderValue >= 0 && sliderValue < 25) {
      setSliderColor('red');
    } else if (sliderValue >= 25 && sliderValue < 50) {
      setSliderColor('orange');
    } else if (sliderValue >= 50 && sliderValue < 75) {
      setSliderColor('yellow');
    } else if (sliderValue >= 75 && sliderValue < 90) {
      setSliderColor('green');
    } else {
      setSliderColor('blue');
    }
  }, [sliderValue]);
  const handleSubmit = async () => {
    setIsLoadingScreen(true);
    if (newPassword !== confirmPassword) {
      toast({
        title: t('Change__Password__Fail__New__Password__Not__Match'),
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top-right',
      });
      setIsLoadingScreen(false);
      return;
    }
    if (sliderValue < 30) {
      toast({
        title: t('Password__Not__Strong'),
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top-right',
      });
      setIsLoadingScreen(false);
      return;
    }
    try {
      const res = await UserApi.updatePassword({
        oldPassword,
        newPassword,
      });
      if (res.status === 200) {
        toast({
          title: t('Change__Password__Success'),
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'top-right',
          onCloseComplete: onClose,
        });
        setIsLoadingScreen(false);
      }
    } catch (error: any) {
      if (error.response.status === 403) {
        toast({
          title: t('Change__Password__Fail__Old__Password__Not__Match'),
          status: 'error',
          duration: 2000,
          isClosable: true,
          position: 'top-right',
        });
        setIsLoadingScreen(false);
        return;
      }
      toast({
        title: t('Change__Password__Fail'),
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top-right',
      });
      setIsLoadingScreen(false);
      return;
    }
  };
  return (
    <Flex alignItems="center" height="fit-content" width="100%" gap="1rem">
      {isLoadingScreen && <LoadingScreen />}

      <Text fontWeight={700} minWidth="120px">
        {t('Password')}
      </Text>
      <Flex boxSizing="border-box" rounded={'md'}>
        <Input
          padding="0"
          variant={'none'}
          type="password"
          disabled
          value={randomPassword}
        />
        <IconButton
          aria-label="change password"
          variant={'ghost'}
          onClick={onOpen}
          icon={<EditIcon />}
        />
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalContent>
          <ModalBody>
            <VStack
              spacing={3}
              divider={<StackDivider />}
              alignItems="flex-start"
            >
              <Flex
                alignItems={'center'}
                justifyContent="space-between"
                width={'full'}
                gap=".2rem"
              >
                <label htmlFor="oldPassword">
                  <Text
                    whiteSpace="nowrap"
                    overflow={'hidden'}
                    fontWeight={700}
                    textOverflow="ellipsis"
                    width="200px"
                  >
                    {t('Old__Password')}
                  </Text>
                </label>
                <Input
                  onChange={(e) => setOldPassword(e.target.value)}
                  id="oldPassword"
                  type="password"
                  _placeholder={{
                    fontWeight: 700,
                    color: 'black',
                    fontSize: '1.2rem',
                  }}
                  value={oldPassword}
                  placeholder={randomPassword.replaceAll(new RegExp(/./g), '.')}
                />
              </Flex>
              <Flex
                alignItems={'center'}
                justifyContent="space-between"
                width={'full'}
                gap=".2rem"
              >
                <label htmlFor="newPassword">
                  <Text
                    whiteSpace="nowrap"
                    overflow={'hidden'}
                    fontWeight={700}
                    textOverflow="ellipsis"
                    width="200px"
                  >
                    {t('New__Password')}
                  </Text>
                </label>
                <Box>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder={t('New__Password')}
                    onChange={handleNewPasswordChange}
                    value={newPassword}
                  />
                  <Slider
                    aria-label="slider-ex-1"
                    value={sliderValue}
                    colorScheme={sliderColor}
                    isReadOnly
                    cursor="default"
                  >
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                  </Slider>
                </Box>
              </Flex>
              <Flex
                alignItems={'center'}
                justifyContent="space-between"
                width={'full'}
                gap=".2rem"
              >
                <label htmlFor="confirmNewPassword">
                  <Text
                    whiteSpace="nowrap"
                    overflow={'hidden'}
                    fontWeight={700}
                    textOverflow="ellipsis"
                    width="200px"
                  >
                    {t('Confirm__New__Password')}
                  </Text>
                </label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  placeholder={t('Confirm__New__Password')}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  value={confirmPassword}
                />
              </Flex>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={5}>
              <Button onClick={onClose}>{t('Cancel')}</Button>
              <Button onClick={handleSubmit} colorScheme={'blue'}>
                {t('Change__Password')}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
