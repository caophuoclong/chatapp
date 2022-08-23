import React from 'react';
import { useMediaQuery } from '@chakra-ui/react';
import Desktop from './Desktop';
import Mobile from './Mobile';
import { useAppSelector } from '~/app/hooks';

type Props = {};

export default function Login({}: Props) {
  const isLargerThanHD = useAppSelector(
    (state) => state.globalSlice.isLargerThanHD
  );
  return <>{isLargerThanHD ? <Desktop /> : <Mobile />}</>;
}
