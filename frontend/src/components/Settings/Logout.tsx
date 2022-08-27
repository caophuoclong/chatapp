import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

type Props = {};

export default function Logout({}: Props) {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const handleLogout = () => {
    window.localStorage.removeItem('access-token');
    navigate('/login');
  };
  return (
    <>
      <Button onClick={onOpen} marginY="1rem">
        {t('Logout')}
      </Button>
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('Logout')}</ModalHeader>
          <ModalBody>{t('Confirm__Logout')}</ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              {t('Cancel')}
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              {t('Logout')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
