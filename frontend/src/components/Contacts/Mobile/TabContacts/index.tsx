import { TabList, TabPanel, TabPanels, Tabs, Tab } from '@chakra-ui/react';
import React from 'react';
import { useAppSelector } from '~/app/hooks';
import Friend from '../Friend';
import { useTranslation } from 'react-i18next';
import Groups from '../Groups';

type Props = {};

export default function TabContacts({}: Props) {
  const friends = useAppSelector(
    (state) => state.friendsSlice.friendShips
  ).filter((f) => f.statusCode.code === 'a');
  const { t } = useTranslation();
  return (
    <Tabs height="83%" boxSizing="border-box">
      <TabList justifyContent={'space-between'}>
        <Tab>{t('Friends')}</Tab>
        <Tab>{t('Group')}</Tab>
        <Tab>{t('Other')}</Tab>
      </TabList>
      <TabPanels height="100%" overflow="auto">
        <TabPanel padding="0">
          {friends.map((friendShip, index) => (
            <Friend
              key={index}
              friendShipId={friendShip._id}
              user={friendShip.user}
              friendId={friendShip.user._id}
              avatarUrl={friendShip.user.avatarUrl}
            />
          ))}
        </TabPanel>
        <TabPanel padding="0" height="100%" overflow="auto">
          <Groups />
        </TabPanel>
        <TabPanel padding="0">
          <p>three!</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
