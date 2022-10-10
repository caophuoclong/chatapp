import { Box, SkeletonCircle, Tag, Text } from '@chakra-ui/react';
import moment from 'moment';
import React, { useState } from 'react';
import ModalShowInfo from '~/components/Modals/ModalShowInfo';
import { AvatarMemo } from '.';
import IFriendShip from '../../../interfaces/IFriendShip';
import { useTranslation } from 'react-i18next';

type Props = {
  friendShip: IFriendShip;
};

export default function DirectHeader({ friendShip }: Props) {
  const { t } = useTranslation();
  const [showFriendInfo, setShowFriendInfo] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          setShowFriendInfo(true);
        }}
      >
        <AvatarMemo
          src={
            friendShip && friendShip.user && friendShip.user.avatarUrl
              ? friendShip.user.avatarUrl
              : ''
          }
          isOnline={friendShip.user?.isOnline}
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
          {friendShip.user.name}
        </Text>
        {
          <>
            {friendShip.statusCode.code === 'a' &&
              friendShip &&
              (friendShip.user.isOnline ? (
                <Text fontSize={'12px'}>{t('Active')}</Text>
              ) : (
                <Text fontSize={'12px'}>
                  {(t('LastActive') as (time: string | number) => String)(
                    moment(new Date(+friendShip.user.lastOnline)).fromNow()
                  )}
                </Text>
              ))}
            {friendShip.statusCode.code === 'p' && (
              <Tag size="sm" colorScheme={'yellow'}>
                {t('Pending')}
              </Tag>
            )}
          </>
        }
      </Box>
    </>
  );
}
