import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '~/app/hooks';
import { default as Friend } from '~/components/LeftFriends/Friend';
type Props = {};

export default function FriendRequest({}: Props) {
  const { t } = useTranslation();
  const friendShips = useAppSelector((state) => state.friendsSlice.friendShips);
  return (
    <Box paddingX="1rem">
      <Text fontWeight={600}>{t('Friends__Request')}</Text>
      {friendShips &&
        friendShips
          .filter((friendship) => friendship.status.code === 'p')
          .map(
            (friendShip, index) =>
              friendShip.flag === 'target' && (
                <Friend
                  key={index}
                  user={friendShip.user}
                  friendShipId={friendShip._id}
                  friendId={friendShip.user._id}
                  avatarUrl={friendShip.user.avatarUrl}
                  isPending={true}
                  isOnline={friendShip.user.isOnline}
                />
              )
          )}
    </Box>
  );
}
