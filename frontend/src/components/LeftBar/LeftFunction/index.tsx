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
import { useAppSelector } from '../../../app/hooks';
import { useTranslation } from 'react-i18next';
import Info from '~/components/user/Info';
import { useColorMode } from '@chakra-ui/react';

type Props = {};

export default function LeftFunction({}: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const [showInfo, setShowInfo] = React.useState(false);
  const user = useAppSelector((state) => state.userSlice.info);
  const { t } = useTranslation();
  return (
    <Flex
      display={{
        base: 'none',
        lg: 'flex',
      }}
      width={'75px'}
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
          src={
            'https://images.unsplash.com/photo-1657516478869-b81f8c25d7e2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
          }
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
        bg={
          location.pathname === '/' || location.pathname.includes('message')
            ? 'gray.200'
            : ''
        }
        icon={
          <AiFillHome
            size="32px"
            color={
              location.pathname === '/' || location.pathname.includes('message')
                ? '#63B3ED'
                : ''
            }
          />
        }
        onClick={() => {
          navigate('/');
        }}
      />
      <IconButton
        height="60px"
        aria-label="home"
        width="full"
        bg={location.pathname === '/contacts' ? 'bg.200' : ''}
        icon={
          <RiContactsBook2Fill
            size="32px"
            color={location.pathname === '/contacts' ? '#63B3ED' : ''}
          />
        }
        onClick={() => {
          navigate('/contacts');
        }}
      />
      <Modal
        isOpen={showInfo}
        onClose={() => {
          setShowInfo(false);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Info />
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                setShowInfo(false);
              }}
            >
              {t('Close')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
