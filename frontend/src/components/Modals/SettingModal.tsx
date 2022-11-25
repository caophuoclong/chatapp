import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ChangeLanguage from '~/components/Settings/ChangeLanguage';
import ToggleTheme from '~/components/Settings/ToggleTheme';
import Logout from '../Settings/Logout';

type Props = {
  isOpen: boolean;
  onClose: (x: boolean) => void;
};

export default function SettingModal({ isOpen, onClose }: Props) {
  const { t } = useTranslation();
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose(false);
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('Setting')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ToggleTheme />
          <ChangeLanguage />
          <Logout />
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => {
              onClose(false);
            }}
          >
            {t('Close')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
