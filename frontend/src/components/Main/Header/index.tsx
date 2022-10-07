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
import ModalShowInfo from '~/components/ModalShowInfo';
import moment from 'moment';
import { IUser } from '../../../interfaces/IUser';
import { setInterval } from 'timers/promises';
import { SERVER_URL } from '~/configs';
type Props = {
  name: string;
  avatarUrl: string;
  friendShip: IFriendShip;
  type: 'group' | 'direct';
};
const AvatarMemo = React.memo(function AvatarMemo({
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
      src={`${SERVER_URL}/images/${src}`}
    >
      <AvatarBadge
        borderColor={isOnline ? 'white' : 'papayawhip'}
        bg={isOnline ? 'green.500' : 'tomato'}
        boxSize="1em"
      />
    </Avatar>
  );
});
export default function Header({ name, avatarUrl, friendShip, type }: Props) {
  const { t } = useTranslation();
  const [showFriendInfo, setShowFriendInfo] = useState(false);
  const showInfo = useAppSelector(
    (state) => state.globalSlice.conversation.showInfoConversation
  );
  const friendShips = useAppSelector((state) => state.friendsSlice.friendShips);
  const [myFriend, setMyFriend] = useState<IUser | null>(null);
  useEffect(() => {
    if (type === 'direct') {
      setMyFriend(
        friendShips.find((friendShip1) => friendShip1._id === friendShip._id)!
          .user
      );
    }
  }, [friendShips]);
  const dispatch = useAppDispatch();
  const { colorMode } = useColorMode();
  return (
    <Flex
      boxSizing="border-box"
      minHeight={{
        base: '6%',
        lg: '6%',
      }}
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
      {friendShip ? (
        <button
          onClick={() => {
            setShowFriendInfo(true);
          }}
        >
          <AvatarMemo src={avatarUrl} isOnline={myFriend?.isOnline} />
        </button>
      ) : (
        <>
          <AvatarMemo src={avatarUrl} isOnline={myFriend?.isOnline} />
        </>
      )}
      {}
      {myFriend && (
        <ModalShowInfo
          showInfo={showFriendInfo}
          setShowInfo={(e: boolean) => {
            setShowFriendInfo(e);
          }}
          user={myFriend}
        />
      )}
      <Box marginX="1rem">
        <Text fontWeight={600} noOfLines={1}>
          {name}
        </Text>
        {friendShip ? (
          <>
            {friendShip.statusCode.code === 'a' &&
              myFriend &&
              (myFriend.isOnline ? (
                <Text fontSize={'12px'}>{t('Active')}</Text>
              ) : (
                <Text fontSize={'12px'}>
                  {(t('LastActive') as (time: string | number) => String)(
                    moment(new Date(+myFriend.lastOnline)).fromNow()
                  )}
                </Text>
              ))}
            {friendShip.statusCode.code === 'p' && (
              <Tag size="sm" colorScheme={'yellow'}>
                {t('Pending')}
              </Tag>
            )}
          </>
        ) : (
          ''
        )}
      </Box>
      <Flex marginLeft="auto" gap=".4rem">
        <IconButton
          bg="none"
          rounded="full"
          aria-label="Call video"
          icon={<BsCameraVideoFill />}
        />
        <IconButton
          bg="none"
          rounded="full"
          aria-label="Call"
          icon={<IoCallSharp />}
        />
        <IconButton
          onClick={() => {
            dispatch(setShowInfoConversation(true));
          }}
          bg={
            showInfo ? (colorMode === 'dark' ? 'gray.700' : 'gray.200') : 'none'
          }
          rounded="full"
          aria-label="Show infor conversations"
          icon={<GiHamburgerMenu />}
        />
      </Flex>
    </Flex>
  );
}
