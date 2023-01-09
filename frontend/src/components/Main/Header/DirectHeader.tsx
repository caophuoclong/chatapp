import { Box, Flex, SkeletonCircle, Tag, Text } from '@chakra-ui/react';
import moment from 'moment';
import React, { useState } from 'react';
import ModalShowInfo from '~/components/Modals/ModalShowInfo';
import { AvatarMemo } from '.';
import IFriendShip from '../../../interfaces/IFriendShip';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { setShowInfoConversation } from '~/app/slices/global.slice';

type Props = {
  friendShip: IFriendShip;
};

export default function DirectHeader({ friendShip }: Props) {
  const { t } = useTranslation();
  const [showFriendInfo, setShowFriendInfo] = useState(false);
  const dispatch = useAppDispatch();
  const isLargerThanHD = useAppSelector(
    (state) => state.globalSlice.isLargerThanHD
  );
  const onShowConversationInfo = () => {
    if (isLargerThanHD) {
    } else {
      dispatch(setShowInfoConversation(true));
    }
  };
  return (
    <Flex
      flexDirection={isLargerThanHD ? 'row' : 'column'}
      onClick={onShowConversationInfo}
    >
      <button
        onClick={() => {
          setShowFriendInfo(true);
        }}
      >
        <AvatarMemo
          src={friendShip && friendShip.user && friendShip.user.avatarUrl}
          isOnline={friendShip && friendShip.user && friendShip.user?.isOnline}
        />
      </button>

      {friendShip && (
        <ModalShowInfo
          showInfo={showFriendInfo}
          setShowInfo={(e: boolean) => {
            setShowFriendInfo(e);
          }}
          user={friendShip.user}
        />
      )}
      <Box marginX="1rem">
        <Text fontWeight={600} noOfLines={1}>
          {friendShip && friendShip.user && friendShip.user.name}
        </Text>
        {
          <>
            {friendShip.status.code === 'a' &&
              friendShip &&
              friendShip.user &&
              (friendShip.user.isOnline ? (
                <Text fontSize={'12px'}>{t('Active')}</Text>
              ) : (
                <Text fontSize={'12px'}>
                  {(t('LastActive') as (time: string | number) => String)(
                    moment(new Date(+friendShip.user.lastOnline)).fromNow()
                  )}
                </Text>
              ))}
            {friendShip.status.code === 'p' && (
              <Tag size="sm" colorScheme={'yellow'}>
                {t('Pending')}
              </Tag>
            )}
          </>
        }
      </Box>
    </Flex>
  );
}
