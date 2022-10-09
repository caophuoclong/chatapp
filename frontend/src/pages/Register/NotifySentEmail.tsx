import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Flex,
  Button,
  Progress,
  Text,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import checkAnimation from '~/assets/images/check.json';
import CircleCheckmark from './CircleCheckmark';
import { useTranslation } from 'react-i18next';
type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function NotifySentEmail({ isOpen, onClose }: Props) {
  const [value, setValue] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    const interval = setInterval(() => {
      setValue((prev) => prev + 20);
    }, 500);
    if (value >= 120) {
      onClose();
      setValue(0);
    }
    return () => {
      clearInterval(interval);
    };
  }, [value]);
  useEffect(() => {
    setTimeout(() => {
      setIsComplete(true);
    }, 700);
  }, []);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent marginY="auto">
        <ModalBody padding="0" rounded={'lg'}>
          <Flex flexDirection={'column'} padding="1rem">
            <CircleCheckmark isDone={isComplete} />
            <Text textAlign={'center'} fontWeight="black">
              {(t('Notify__SentEmail') as (x: string) => string)('email')}
            </Text>
          </Flex>
          <Flex justifyContent={'center'}>
            <Button
              variant={'solid'}
              alignSelf="center"
              width="22%"
              rounded="md"
              bgColor={'#3B82F6'}
              _hover={{ bgColor: '#2563EB' }}
              onClick={onClose}
            >
              {t('Close')}
            </Button>
          </Flex>
          <Progress size="xs" value={value} marginTop="1rem" rounded="lg" />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
