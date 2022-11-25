import { Flex, useMediaQuery } from '@chakra-ui/react';
import { is } from 'immer/dist/internal';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '~/app/hooks';

type Props = {};

export default function Friends({}: Props) {
  const isLargerThanHD = useAppSelector(
    (state) => state.globalSlice.isLargerThanHD
  );
  const navigate = useNavigate();
  // useEffect(() => {
  //   console.log(isLargerThanHD);
  //   if (!isLargerThanHD) {
  //     navigate('/contacts');
  //   } else {
  //     navigate('/friends');
  //   }
  // }, [isLargerThanHD]);
  return <Flex width={'82%'}>Contacts</Flex>;
}
