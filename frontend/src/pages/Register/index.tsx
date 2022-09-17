import React from 'react';
import { useMediaQuery, useToast } from '@chakra-ui/react';
import Desktop from './Desktop';
import Mobile from './Mobile';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { IRegisterRequest } from '~/interfaces/IRegister';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { register } from '~/app/slices/global.slice';
import { unwrapResult } from '@reduxjs/toolkit';
import getKeyByValue from '~/utils/getKeyByValue';

type Props = {};

export default function Register({}: Props) {
  const isLargerThanHD = useAppSelector(
    (state) => state.globalSlice.isLargerThanHD
  );
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const onSubmit = async (data: IRegisterRequest) => {
    try {
      const res = await dispatch(register(data));
      const response = unwrapResult(res);
      toast({
        title: t('Success'),
        description: t('Success__Register'),
        status: 'success',
        position: isLargerThanHD ? 'top-right' : 'bottom',
        duration: 1000,
        onCloseComplete: () => {
          navigate('/login');
        },
      });
    } catch (error: any) {
      const data1 = error.response.data;
      console.log(error);
      if (data1) {
        if (data1.message.includes('Duplicate')) {
          const value = data1.message.split(' ')[2];
          toast({
            title: t('Error'),
            description: (t('IsExist') as (x: string) => string)(
              getKeyByValue(data, (value as string).replaceAll("'", '')) || ''
            ),
            position: isLargerThanHD ? 'top-right' : 'bottom',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        } else {
          toast({
            title: t('Error'),
            description: t('Error__Register'),
            position: isLargerThanHD ? 'top-right' : 'bottom',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        toast({
          title: t('Error'),
          description: t('Error__Register'),
          position: isLargerThanHD ? 'top-right' : 'bottom',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
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
