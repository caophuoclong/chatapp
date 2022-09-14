import React from 'react';
import { useMediaQuery, useToast } from '@chakra-ui/react';
import Desktop from './Desktop';
import Mobile from './Mobile';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import LoadingScreen from '~/components/LoadingScreen';
import { useNavigate } from 'react-router-dom';
import { ILoginRequest } from '~/interfaces/ILogin';
import { login } from '~/app/slices/global.slice';
import { unwrapResult } from '@reduxjs/toolkit';
import { useTranslation } from 'react-i18next';

type Props = {};

export default function Login({}: Props) {
  const isLargerThanHD = useAppSelector(
    (state) => state.globalSlice.isLargerThanHD
  );
  const { t } = useTranslation();

  const isLogin = useAppSelector((state) => state.globalSlice.loading.login);
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const onSubmit = async (data: ILoginRequest) => {
    try {
      const res = await dispatch(login(data));

      const response = unwrapResult(res);
      console.log(response);
      window.localStorage.setItem('access_token', response.data.access_token);
      window.localStorage.setItem('expiredTime', response.data.expiredTime);

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
      toast({
        title: t('Error'),
        description: t('Password__NotMatch'),
        status: 'error',
        position: isLargerThanHD ? 'top-right' : 'bottom',
        duration: 3000,
        isClosable: true,
      });
    }
    console.log(data);
  };
  return (
    <>
      {isLogin && <LoadingScreen />}
      {isLargerThanHD ? (
        <Desktop onSubmit={onSubmit} />
      ) : (
        <Mobile onSubmit={onSubmit} />
      )}
    </>
  );
}
