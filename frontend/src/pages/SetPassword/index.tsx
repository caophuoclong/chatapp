import React, { ChangeEvent, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  useMediaQuery,
  useToast,
} from '@chakra-ui/react';
import queryString from 'query-string';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import { login } from '~/app/slices/global.slice';
import { unwrapResult } from '@reduxjs/toolkit';
import background from '~/assets/images/bg_login.png';
import { useTranslation } from 'react-i18next';
import ChangeLanguage from '~/components/Settings/ChangeLanguage';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CheckCircleIcon } from '@chakra-ui/icons';
import Auth from '~/services/apis/Auth.api';
type Props = {};
const schema = yup.object().shape({
  newPassword: yup
    .string()
    .required()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z0-9_@.#&^+-]{8,}$/),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], "Password doesn't match"),
});
const regAtLeastUpper = new RegExp(/^(?=.*?[A-Z]).{1,}$/);
const regAtLeastNum = new RegExp(/^(?=.*?[0-9]).{1,}$/);
const regAtLeastSpecial = new RegExp(/^(?=.*?[#?!@$%^&*-]).{1,}$/);

export default function SetPassword({}: Props) {
  const isLargerThanHD = useAppSelector(
    (state) => state.globalSlice.isLargerThanHD
  );
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const [atLeast, setAtLeast] = useState(false);
  const [atLeastUpper, setAtLeastUpper] = useState(false);
  const [atLeastNum, setAtLeastNum] = useState(false);
  const [atLeastSpecial, setAtLeastSpecial] = useState(false);
  const [isMatched, setIsMatched] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { search } = useLocation();
  const token = queryString.parse(search).token as string;
  const onSubmit = handleSubmit(async (data) => {
    try {
      const { newPassword, confirmPassword } = data;

      if (!token) {
        alert('Token is not exist');
        navigate('/login');
      } else {
        const response = await Auth.resetPassword(token, newPassword);
        console.log(response);
        toast({
          title: t('Success'),
          description: t('Password__Reset__Success'),
          status: 'success',
          position: isLargerThanHD ? 'top-right' : 'bottom',
          duration: 3000,
          isClosable: true,
        });
        navigate('/login');
      }
    } catch (error) {}
  });

  return (
    <form onSubmit={onSubmit}>
      <Box
        bg="none"
        position="absolute"
        right="0"
        margin="1rem"
        zIndex={50}
        color="white"
      >
        <ChangeLanguage />
      </Box>
      <Box
        width="100vw"
        height="100vh"
        position="relative"
        bg=" #1F41A9"
        style={{
          backgroundImage: `url(${background})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
        color="white"
      >
        <Flex
          width={isLargerThanHD ? '30%' : '100%'}
          height="100%"
          justifyContent="center"
          alignItems={'center'}
          flexDirection="column"
          paddingX="1rem"
          gap=".5rem"
          marginX="auto"
        >
          <Heading>{t('Reset__Password')}</Heading>
          <FormControl>
            <FormLabel>{t('New__Password')}</FormLabel>
            <Input
              type="password"
              {...register('newPassword', {
                onChange(event: ChangeEvent<HTMLInputElement>) {
                  const value = event.target.value;
                  if (value.length >= 8) setAtLeast(true);
                  else setAtLeast(false);
                  if (regAtLeastUpper.test(value)) setAtLeastUpper(true);
                  else setAtLeastUpper(false);
                  if (regAtLeastNum.test(value)) setAtLeastNum(true);
                  else setAtLeastNum(false);
                  if (regAtLeastSpecial.test(value)) setAtLeastSpecial(true);
                  else setAtLeastSpecial(false);
                  if (getValues().newPassword === getValues().confirmPassword)
                    setIsMatched(true);
                  else setIsMatched(false);
                },
              })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>{t('Confirm__Password')}</FormLabel>
            <Input
              type="password"
              {...register('confirmPassword', {
                onChange(event) {
                  if (getValues().newPassword === getValues().confirmPassword)
                    setIsMatched(true);
                  else setIsMatched(false);
                },
              })}
            />
          </FormControl>
          <Box width="100%">
            <Flex
              color={atLeast ? 'green.300' : 'gray.300'}
              gap=".2rem"
              alignItems={'center'}
            >
              <CheckCircleIcon />
              <Text>{t('At__Least__8')}</Text>
            </Flex>
            <Flex
              color={atLeastUpper ? 'green.300' : 'gray.300'}
              gap=".2rem"
              alignItems={'center'}
            >
              <CheckCircleIcon />
              <Text>{t('At__Least__Upper')}</Text>
            </Flex>
            <Flex
              color={atLeastNum ? 'green.300' : 'gray.300'}
              gap=".2rem"
              alignItems={'center'}
            >
              <CheckCircleIcon />
              <Text>{t('At__Least__Num')}</Text>
            </Flex>
            <Flex
              color={atLeastSpecial ? 'green.300' : 'gray.300'}
              gap=".2rem"
              alignItems={'center'}
            >
              <CheckCircleIcon />
              <Text>{t('At__Least__Special')}</Text>
            </Flex>
            <Flex
              color={isMatched ? 'green.300' : 'gray.300'}
              gap=".2rem"
              alignItems={'center'}
            >
              <CheckCircleIcon />
              <Text>{t('Password__Matched')}</Text>
            </Flex>
          </Box>
          <Button color="blue" type="submit">
            {t('Reset')}
          </Button>
        </Flex>
      </Box>
    </form>
  );
}
