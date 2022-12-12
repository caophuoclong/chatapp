import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  Flex,
  Box,
  Avatar,
  Text,
  IconButton,
  AvatarBadge,
  useColorMode,
  Tag,
  SkeletonCircle,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BsCameraVideoFill } from 'react-icons/bs';
import { IoCallSharp } from 'react-icons/io5';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { GiHamburgerMenu } from 'react-icons/gi';
import IFriendShip from '../../../interfaces/IFriendShip';
import {
  setShowInfoConversation,
  setChoosenConversationID,
} from '~/app/slices/global.slice';
import ModalShowInfo from '~/components/Modals/ModalShowInfo';
import moment from 'moment';
import { IUser } from '../../../interfaces/IUser';
import { setInterval } from 'timers/promises';
import { SERVER_URL } from '~/configs';
import GroupHeader from './GroupHeader';
import DirectHeader from './DirectHeader';
import HeaderBtn from './HeaderBtn';
import { renderAvatar } from '~/utils/renderAvatar';
type Props = {
  name: string;
  avatarUrl: string;
  friendShip: IFriendShip | undefined;
  participants: IUser[];
  type: 'group' | 'direct';
  _id: string;
  owner: IUser;
};
export const AvatarMemo = React.memo(function AvatarMemo({
  src,
  isOnline,
}: {
  src: string;
  isOnline?: boolean;
}) {
  return (
    <Avatar
      width="40px"
      height="40px"
      display={{
        base: 'none',
        lg: 'block',
      }}
      src={renderAvatar(src)}
    >
      <AvatarBadge
        borderColor={isOnline ? 'white' : 'papayawhip'}
        bg={isOnline ? 'green.500' : 'tomato'}
        boxSize="1em"
      />
    </Avatar>
  );
});
export default function Header({
  name,
  avatarUrl,
  friendShip,
  type,
  participants,
  _id,
  owner,
}: Props) {
  const { t } = useTranslation();
  const showInfo = useAppSelector(
    (state) => state.globalSlice.conversation.showInfoConversation
  );
  const dispatch = useAppDispatch();
  const { colorMode } = useColorMode();
  return (
    <Flex
      boxSizing="border-box"
      minHeight="55px"
      alignItems="center"
      justifyContent={'flex-start'}
      paddingX="1rem"
      paddingY=".3rem"
      borderBottom={
        colorMode === 'dark'
          ? '1px solid rgba(255, 255, 255,0.3)'
          : '1px solid  rgba(0, 0, 0, 0.08)'
      }
    >
      <ArrowBackIcon
        fontSize={'1.5rem'}
        display={{
          base: 'block',
          lg: 'none',
        }}
        onClick={() => {
          dispatch(setChoosenConversationID(''));
        }}
      />

      {type === 'group' && (
        <GroupHeader
          participants={participants}
          name={name}
          avatarUrl={avatarUrl}
          _id={_id}
          owner={owner}
        />
      )}
      {type === 'direct' && friendShip && (
        <DirectHeader friendShip={friendShip} />
      )}
      <HeaderBtn />
    </Flex>
  );
}
