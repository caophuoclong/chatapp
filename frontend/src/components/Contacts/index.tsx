import React, { useEffect } from 'react';
import Mobile from './Mobile';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import Desktop from './Desktop/index';

type Props = {};

export default function Contacts({}: Props) {
  const isLargerThanHD = useAppSelector(
    (state) => state.globalSlice.isLargerThanHD
  );
  return <>{isLargerThanHD ? <Desktop /> : <Mobile />}</>;
}
