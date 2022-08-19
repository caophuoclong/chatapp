import React, { useEffect } from 'react';
import { Box, Flex, Hide, Show, useMediaQuery } from '@chakra-ui/react';
import Header from './Header';
import MessagesBox from './MessagesBox';
import InputBox from './InputBox';
import { useLocation, useParams } from 'react-router-dom';
import { useState } from 'react';
import InfoConversation from './InfoConversation/index';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { setShowInfoConversation } from '~/app/slices/global.slice';

type Props = {};

export default function Main({}: Props) {
  let location = useLocation();
  const [isLargerThanHD] = useMediaQuery(['(min-width: 1024px)']);
  console.log(isLargerThanHD);
  const showInfo = useAppSelector(
    (state) => state.globalSlice.conversation.showInfoConversation
  );
  const dispatch = useAppDispatch();
  const r = new RegExp('/message/[A-Za-z0-9]{3,16}/info');
  useEffect(() => {
    r.test(location.pathname)
      ? dispatch(setShowInfoConversation(true))
      : dispatch(setShowInfoConversation(false));
  }, [location]);
  return (
    <Flex
      width={{
        base: '100%',
        lg: '82%',
      }}
      boxSizing="border-box"
      direction={'column'}
    >
      {!showInfo ? (
        <>
          <Header />
          <MessagesBox />
          <InputBox />
        </>
      ) : isLargerThanHD ? (
        <Flex height={'100%'}>
          <Flex
            width={{
              base: '100%',
              lg: '82%',
            }}
            height="100%"
            boxSizing="border-box"
            direction={'column'}
          >
            <Header />
            <MessagesBox />
            <InputBox />
          </Flex>
          <InfoConversation />
        </Flex>
      ) : (
        <InfoConversation />
      )}
    </Flex>
  );
}
