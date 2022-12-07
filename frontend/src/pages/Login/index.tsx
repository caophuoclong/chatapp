import React from 'react';
import {
  Box,
  Button,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';

import { useAppDispatch, useAppSelector } from '~/app/hooks';
import LoadingScreen from '~/components/LoadingScreen';
import { Link, useNavigate } from 'react-router-dom';
import { ILoginRequest } from '~/interfaces/ILogin';
import { login, setSocket } from '~/app/slices/global.slice';
import { unwrapResult } from '@reduxjs/toolkit';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { regPassword } from '../SetPassword';
import { FormProvider, useForm } from 'react-hook-form';
import ChangeLanguage from '~/components/Settings/ChangeLanguage';
import background from '~/assets/images/bg_login.png';
import MyInput from '~/components/MyInput';
import { FaUser } from 'react-icons/fa';
import { BsKey } from 'react-icons/bs';
import { yupResolver } from '@hookform/resolvers/yup';
import ErrorShow from '~/components/ErrorShow';
import NotActive from './NotActive';
import { connectSocket } from '~/utils/connectSocket';
type Props = {};
const loginSchema = yup.object().shape({
  username: yup.string().required('Username__Required').trim().lowercase(),
  password: yup.string().required('Password__Required'),
});
export default function Login({}: Props) {
  const isLargerThanHD = useAppSelector(
    (state) => state.globalSlice.isLargerThanHD
  );
  const { t } = useTranslation();
  const [showNotActive, setShowNotActive] = React.useState<boolean>(false);
  const isLogin = useAppSelector((state) => state.globalSlice.loading.login);
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const methods = useForm<ILoginRequest>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
  });
  const {
    formState: { errors },
  } = methods;

  const onSubmit = async (data: ILoginRequest) => {
    try {
      const res = await dispatch(login(data));
      const response = unwrapResult(res);
      window.localStorage.setItem('access_token', response.data.token);
      window.localStorage.setItem('expiredTime', response.data.expired_time);
      if (response.data.token) {
        dispatch(setSocket(connectSocket(response.data.token)));
      }
      toast({
        title: t('Success'),
        description: t('Success__Login'),
        status: 'success',
        position: isLargerThanHD ? 'top-right' : 'bottom',
        duration: 1000,
        onCloseComplete: async () => {
          navigate('/');
        },
      });
    } catch (error: any) {
      console.log(error);
      if (error.message === 'INACTIVE') {
        setShowNotActive(true);
      } else {
        toast({
          title: t('Error'),
          description: t('Password__NotMatch'),
          status: 'error',
          position: isLargerThanHD ? 'top-right' : 'bottom',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };
  return (
    <>
      {isLogin && <LoadingScreen />}
      {showNotActive && (
        <NotActive
          onClose={() => setShowNotActive(false)}
          isOpen={showNotActive}
        />
      )}
      <FormProvider {...methods}>
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
        >
          <Flex
            justifyContent={'center'}
            direction="column"
            alignItems={'center'}
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            width={isLargerThanHD ? '50%' : '100%'}
          >
            <Box marginY="40px">
              <Text
                textAlign={'center'}
                fontSize="48px"
                fontWeight={700}
                color="white"
              >
                {t('Login')}
              </Text>
              <Text
                fontWeight={700}
                color="white"
                fontSize={'16px'}
                textAlign="center"
              >
                {t('Details__Login')}
              </Text>
            </Box>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <Flex direction={'column'} gap="5px" color="white">
                <MyInput
                  icon={<FaUser size="34px" />}
                  name="username"
                  placeholder={t('Username')}
                />
                {errors.username?.message && (
                  <ErrorShow>{errors.username.message}</ErrorShow>
                )}
                <MyInput
                  icon={<BsKey size="34px" />}
                  name="password"
                  type="password"
                  placeholder={t('Password')}
                />
                {errors.password?.message && (
                  <ErrorShow>{errors.password.message}</ErrorShow>
                )}

                <Link to="/forgot-password">
                  <Text fontSize={12} textAlign="right">
                    {t('Forgot__Password')}
                  </Text>
                </Link>
                <Button
                  type="submit"
                  bg="none"
                  borderRadius={'15px'}
                  color="#00FF29"
                  border="2px solid #00FF29"
                  _hover={{
                    bg: 'none',
                  }}
                >
                  {t('Login')}
                </Button>
              </Flex>
            </form>
            <Flex
              marginY="1rem"
              justifyContent={'center'}
              gap="3px"
              color="white"
            >
              <Text>{t('Not__Registered')}</Text>
              <Link to="/register">
                <Text fontStyle={'italic'} color="#318ABC">
                  {t('Register')}
                </Text>
              </Link>
            </Flex>
          </Flex>
        </Box>
      </FormProvider>
    </>
  );
}
