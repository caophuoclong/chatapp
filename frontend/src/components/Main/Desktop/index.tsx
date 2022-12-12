import React, { useEffect, useState } from 'react';
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
import { useLocation } from 'react-router-dom';
import InfoConversation from '../InfoConversation/index';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { setShowInfoConversation } from '~/app/slices/global.slice';
import { useTranslation } from 'react-i18next';
import IConversation from '../../../interfaces/IConversation';
import IFriendShip from '../../../interfaces/IFriendShip';
import { ConversationType } from '../../../interfaces/IConversation';

type Props = {
  choosenConversation: IConversation;
};

export default function Main({ choosenConversation }: Props) {
  let location = useLocation();
  const showInfo = useAppSelector(
    (state) => state.globalSlice.conversation.showInfoConversation
  );
  const dispatch = useAppDispatch();
  const [friendShip, setFriendShip] = useState<IFriendShip>();
  const friendShips = useAppSelector((state) => state.friendsSlice.friendShips);
  const r = new RegExp('/message/[A-Za-z0-9]{3,16}/info');
  const { t } = useTranslation();
  useEffect(() => {
    r.test(location.pathname)
      ? dispatch(setShowInfoConversation(true))
      : dispatch(setShowInfoConversation(false));
  }, [location]);
  useEffect(() => {
    if (choosenConversation.type === 'direct') {
      const friendShip = friendShips.find((friendShip) => {
        return choosenConversation.friendship._id === friendShip._id;
      });
      setFriendShip(friendShip);
    }
  }, [friendShips, choosenConversation]);
  return choosenConversation ? (
    <Flex
      width={{
        base: '100%',
        lg: 'calc(100% - 420px)',
      }}
      boxSizing="border-box"
      direction={'column'}
    >
      <Header
        name={choosenConversation.name}
        avatarUrl={choosenConversation.avatarUrl}
        friendShip={friendShip}
        participants={choosenConversation.participants}
        type={choosenConversation.type}
        _id={choosenConversation._id}
        owner={choosenConversation.owner}
      />
      <MessagesBox />
      <InputBox conversation={choosenConversation} />
      <Drawer
        isOpen={showInfo}
        placement="right"
        onClose={() => {
          dispatch(setShowInfoConversation(false));
        }}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader textAlign={'center'}>
            {t('Info__Conversation')}
          </DrawerHeader>
          <DrawerBody margin="0" padding="0">
            <InfoConversation />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  ) : (
    <Flex width="80%"></Flex>
  );
}
