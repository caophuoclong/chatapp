import { Flex, useMediaQuery } from '@chakra-ui/react';
import { is } from 'immer/dist/internal';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {};

export default function Friends({}: Props) {
  const [isLargerThanHD] = useMediaQuery(['(min-width: 1024px)']);
  const navigate = useNavigate();
  console.log(isLargerThanHD);
  //   useEffect(() => {
  //     console.log(isLargerThanHD);
  //     if (isLargerThanHD) {
  //       navigate('/contacts');
  //     } else {
  //       navigate('/friends');
  //     }
  //   }, [isLargerThanHD]);
  return <Flex width={'82%'}>Friends</Flex>;
}
