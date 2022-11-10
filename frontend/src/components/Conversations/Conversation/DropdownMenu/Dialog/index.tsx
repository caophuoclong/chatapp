import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { DialogType } from '..';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  type: DialogType;
  onConfirm: (type: DialogType) => void;
};
const Dialog = ({
  isOpen,
  onClose,
  title,
  content,
  onConfirm,
  type,
}: Props) => {
  const { t } = useTranslation();
  const cancelRef = useRef(null);
  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={true}
      closeOnEsc={true}
      isCentered={true}
      leastDestructiveRef={cancelRef}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {t(title)}
          </AlertDialogHeader>

          <AlertDialogBody>{t(content)}</AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              {t('Cancel')}
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                console.log(1231231231);
                onConfirm(type);
              }}
              ml={3}
            >
              {t('Confirm')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
export default Dialog;
