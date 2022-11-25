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
import { VscError } from 'react-icons/vsc';
import { useTranslation } from 'react-i18next';
type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function NotActive({ isOpen, onClose }: Props) {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent marginY="auto">
        <ModalBody padding="0" rounded={'lg'}>
          <Flex flexDirection={'column'} padding="1rem" alignItems={'center'}>
            <VscError size="80px" fill="#ed4337" />
            <Text textAlign={'center'} fontWeight="black">
              {t('Not__Active')}
            </Text>
          </Flex>
          <Flex justifyContent={'center'} marginY="1rem">
            <Button
              variant={'solid'}
              alignSelf="center"
              width="22%"
              rounded="md"
              bgColor={'#ed4337'}
              _hover={{ bgColor: '#ed4432' }}
              onClick={onClose}
            >
              {t('Close')}
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
