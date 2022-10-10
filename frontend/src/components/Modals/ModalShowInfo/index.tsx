import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React from 'react';
import { IUser } from '../../../interfaces/IUser';
import { useTranslation } from 'react-i18next';
import Info from '../../user/Info';

type Props = {
  user: IUser;
  showInfo: boolean;
  setShowInfo: (showInfo: boolean) => void;
};

export default function ModalShowInfo({ user, showInfo, setShowInfo }: Props) {
  const { t } = useTranslation();
  return (
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
          <Info user={user} />
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
  );
}
