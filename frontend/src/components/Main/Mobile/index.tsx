import React, { useEffect } from 'react';
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Hide,
  Show,
  useMediaQuery,
  Button,
} from '@chakra-ui/react';
import Header from '../Header';
import MessagesBox from '../MessagesBox';
import InputBox from '../InputBox';
import { useLocation, useParams } from 'react-router-dom';
import { useState } from 'react';
import InfoConversation from '../InfoConversation/index';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { setShowInfoConversation } from '~/app/slices/global.slice';
import { useTranslation } from 'react-i18next';
import IConversation from '../../../interfaces/IConversation';

type Props = {
  choosenConversation: IConversation;
};

export default function Main({ choosenConversation }: Props) {
  let location = useLocation();
  const showInfo = useAppSelector(
    (state) => state.globalSlice.conversation.showInfoConversation
  );
  const dispatch = useAppDispatch();
  const r = new RegExp('/message/[A-Za-z0-9]{3,16}/info');
  const { t } = useTranslation();
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
      {showInfo ? (
        <InfoConversation />
      ) : (
        <>
          <Header
            name={choosenConversation.name}
            avatarUrl={choosenConversation.avatarUrl}
            friendShip={choosenConversation.friendship}
            type={choosenConversation.type}
            participants={choosenConversation.participants}
            _id={choosenConversation._id}
            owner={choosenConversation.owner}
          />
          <MessagesBox />
          <InputBox />
        </>
      )}
    </Flex>
  );
}
