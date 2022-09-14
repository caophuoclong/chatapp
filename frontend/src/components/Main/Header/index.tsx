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
import React, { useState } from 'react';
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
type Props = {
  name: string;
  avatarUrl: string;
  friendShip: IFriendShip;
  type: 'group' | 'direct';
};
const AvatarMemo = React.memo(function AvatarMemo({ src }: { src: string }) {
  return (
    <Avatar
      width="40px"
      height="40px"
      display={{
        base: 'none',
        lg: 'block',
      }}
      src={src}
    >
      <AvatarBadge borderColor="papayawhip" bg="tomato" boxSize="1em" />
    </Avatar>
  );
});
export default function Header({ name, avatarUrl, friendShip, type }: Props) {
  const { t } = useTranslation();
  const [showFriendInfo, setShowFriendInfo] = useState(false);
  const navigate = useNavigate();
  const showInfo = useAppSelector(
    (state) => state.globalSlice.conversation.showInfoConversation
  );
  const friendShips = useAppSelector((state) => state.friendsSlice.friendShips);
  console.log(
    '🚀 ~ file: index.tsx ~ line 54 ~ Header ~ friendShips',
    friendShips
  );

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
          <AvatarMemo src={avatarUrl} />
        </button>
      ) : (
        <>
          <AvatarMemo src={avatarUrl} />
        </>
      )}
      {}
      {type === 'direct' && (
        <ModalShowInfo
          showInfo={showFriendInfo}
          setShowInfo={(e: boolean) => {
            setShowFriendInfo(e);
          }}
          user={
            friendShips.find(
              (friendShip1) => friendShip1._id === friendShip._id
            )!.user
          }
        />
      )}
      <Box marginX="1rem">
        <Text fontWeight={600} noOfLines={1}>
          {name}
        </Text>
        {friendShip ? (
          <>
            {friendShip.statusCode.code === 'a' && (
              <Text fontSize={'12px'}>
                {(t('LastActive') as (time: string | number) => String)(5)}
              </Text>
            )}
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
