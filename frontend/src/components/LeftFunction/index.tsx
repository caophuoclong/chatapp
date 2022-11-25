import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tooltip,
} from '@chakra-ui/react';
import React from 'react';
import { AiFillHome } from 'react-icons/ai';
import { FaUserAlt } from 'react-icons/fa';
import { RiContactsBook2Fill } from 'react-icons/ri';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { useTranslation } from 'react-i18next';
import Info from '~/components/user/Info';
import { useColorMode } from '@chakra-ui/react';
import { ENUM_SCREEN, setShowScreen } from '~/app/slices/global.slice';
import ModalShowInfo from '../Modals/ModalShowInfo';
import { SERVER_URL } from '~/configs';

type Props = {};

export default function LeftFunction({}: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const [showInfo, setShowInfo] = React.useState(false);
  const user = useAppSelector((state) => state.userSlice.info);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const showScreen = useAppSelector((state) => state.globalSlice.showScreen);

  return (
    <Flex
      display={{
        base: 'none',
        lg: 'flex',
      }}
      width={'4%'}
      //   bg="red.100"
      borderRight={
        colorMode === 'dark'
          ? '1px solid rgba(255, 255, 255,0.3)'
          : '1px solid  rgba(0, 0, 0, 0.08)'
      }
      paddingY="1rem"
      boxSizing="border-box"
      direction="column"
      alignItems={'center'}
    >
      <Tooltip label={t('Show__info')} placement="right-end">
        <Avatar
          src={`${SERVER_URL}/images/${user.avatarUrl}`}
          marginY="1rem"
          cursor={'pointer'}
          onClick={() => {
            setShowInfo(true);
          }}
        />
      </Tooltip>
      <IconButton
        height="60px"
        aria-label="home"
        width="full"
        bg={showScreen === ENUM_SCREEN.CONVERSATIONS ? 'gray.200' : ''}
        icon={
          <AiFillHome
            size="32px"
            color={showScreen === ENUM_SCREEN.CONVERSATIONS ? '#63B3ED' : ''}
          />
        }
        onClick={() => {
          dispatch(setShowScreen(ENUM_SCREEN.CONVERSATIONS));
        }}
      />
      <IconButton
        height="60px"
        aria-label="home"
        width="full"
        bg={showScreen === ENUM_SCREEN.CONTACTS ? 'gray.200' : ''}
        icon={
          <RiContactsBook2Fill
            size="32px"
            color={showScreen === ENUM_SCREEN.CONTACTS ? '#63B3ED' : ''}
          />
        }
        onClick={() => {
          dispatch(setShowScreen(ENUM_SCREEN.CONTACTS));
        }}
      />
      <ModalShowInfo
        setShowInfo={(f: boolean) => setShowInfo(f)}
        showInfo={showInfo}
        user={user}
      />
    </Flex>
  );
}
