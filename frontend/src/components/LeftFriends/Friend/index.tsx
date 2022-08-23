import { ChevronDownIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Avatar,
  AvatarBadge,
  Box,
  Flex,
  Text,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { FiMoreHorizontal } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ModalShowInfo from '~/components/ModalShowInfo';
import { IUser } from '~/interfaces/IUser';
import { useAppSelector } from '../../../app/hooks';

type Props = {
  user: IUser;
  avatarUrl: string;
  isOnline?: boolean;
  friendShipId: number;
  friendId: string;
};

export default function Friend({ user, isOnline, friendShipId }: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showInfo, setShowInfo] = useState(false);
  const isLargerThanHD = useAppSelector(
    (state) => state.globalSlice.isLargerThanHD
  );
  return (
    <Flex
      paddingY="1rem"
      paddingX=".5rem"
      rounded="md"
      _hover={{
        bg: 'blue.300',
      }}
      alignItems="center"
      gap="1rem"
      role="group"
    >
      <Avatar src={user.avatarUrl}>
        <AvatarBadge
          borderColor={isOnline ? '' : 'papayawhip'}
          bg={isOnline ? 'green.500' : 'tomato'}
          boxSize="1em"
        />{' '}
      </Avatar>
      <Text fontWeight={600}>{user.name}</Text>
      <Menu>
        <MenuButton
          as={Button}
          marginLeft="auto"
          bg="none"
          _hover={{ bg: 'none' }}
          _active={{ bg: 'none' }}
          display={isLargerThanHD ? 'none' : 'flex'}
          _groupHover={{
            display: 'flex',
          }}
        >
          <FiMoreHorizontal fontSize={'24px'} />
        </MenuButton>
        <MenuList>
          <MenuItem
            onClick={() => {
              setShowInfo(true);
            }}
          >
            {t('Show__Info')}
          </MenuItem>
          <MenuItem>{t('Delete__Friend')}</MenuItem>
        </MenuList>
      </Menu>
      {showInfo && (
        <ModalShowInfo
          user={user}
          showInfo={showInfo}
          setShowInfo={(f: boolean) => setShowInfo(f)}
        />
      )}
    </Flex>
  );
}
