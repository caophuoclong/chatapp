import {
  Box,
  Button,
  Flex,
  Input,
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
import FoundUser from './FoundUser';

type Props = {
  setShow: () => void;
};

export default function AddFriendsModal({ setShow }: Props) {
  const { t } = useTranslation();
  return (
    <Modal onClose={setShow} size={'sm'} isOpen={true}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('AddFriend')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody padding="0">
          <Flex direction={'column'}>
            <Flex boxSizing="border-box" paddingX=".5rem">
              {/* <label htmlFor="">{t('Username')}</label> */}
              <Input placeholder={t('Username')} variant={'flushed'} />
            </Flex>
            <Box
              marginY="1rem"
              boxSizing="border-box"
              overflow={'auto'}
              maxHeight="700px"
            >
              {false && <FoundUser />}
            </Box>
          </Flex>
        </ModalBody>
        <ModalFooter gap="1rem">
          <Button onClick={setShow}>{t('Cancel')}</Button>
          <Button
            bg="blue.100"
            onClick={setShow}
            _hover={{
              bg: 'blue.300',
            }}
          >
            {t('Search')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
