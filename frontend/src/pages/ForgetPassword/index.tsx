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
import Auth from '~/services/apis/Auth.api';

type Props = {};

export default function ForgetPassword({}: Props) {
  const isLargerThanHD = useAppSelector(
    (state) => state.globalSlice.isLargerThanHD
  );
  const { t } = useTranslation();

  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const onSubmit = async (data: { email: string }) => {
    const { email } = data;
    // validate email

    const reg = new RegExp(
      /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
    );
    if (!reg.test(email)) {
      toast({
        title: t('Error'),
        description: t('Invalid__Email'),
        status: 'error',
        position: isLargerThanHD ? 'top-right' : 'bottom',
        duration: 1000,
      });
    } else {
      try {
        const response = await Auth.forgotPassword(email);
        console.log(response);
        toast({
          title: t('Success'),
          description: t('Detail__Recover__Email'),
          status: 'success',
          position: isLargerThanHD ? 'top-right' : 'bottom',
          duration: 3000,
          isClosable: true,
        });
      } catch (error: any) {
        if (error.response.status === 404) {
          toast({
            title: t('Error'),
            description: t('Email__Not__Exist'),
            status: 'error',
            position: isLargerThanHD ? 'top-right' : 'bottom',
            duration: 3000,
            isClosable: true,
          });
        } else {
          console.log(error);
        }
      }
    }
  };
  return (
    <>
      {isLargerThanHD ? (
        <Desktop onSubmit={onSubmit} />
      ) : (
        <Mobile onSubmit={onSubmit} />
      )}
    </>
  );
}
