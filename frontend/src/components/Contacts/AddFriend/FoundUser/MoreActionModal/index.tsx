import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { AiOutlineIdcard, AiOutlineStop } from 'react-icons/ai';
import { useTranslation } from 'react-i18next';
import { MdOutlineReportGmailerrorred } from 'react-icons/md';

type Props = {
  setShow: () => void;
};

export default function MoreActionModal({ setShow }: Props) {
  const { t } = useTranslation();
  return (
    <Modal isOpen={true} onClose={setShow}>
      <ModalOverlay />
      <ModalContent width="90%">
        <ModalHeader>Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Button
            display={'block'}
            textAlign="left"
            bg="none"
            padding="1rem"
            height="60px"
            rounded="none"
            fontWeight={'normal'}
          >
            <Flex direction="column" gap="1rem">
              <Flex gap="1rem">
                <AiOutlineIdcard fontSize={'24px'} />
                <Box borderBottom="2px solid rgba(0,0,0,0.08)" width="100%">
                  <Text>{t('ShareContact')}</Text>
                </Box>
              </Flex>
            </Flex>
          </Button>
          <Button
            display={'block'}
            textAlign="left"
            bg="none"
            padding="1rem"
            height="60px"
            rounded="none"
            fontWeight={'normal'}
          >
            <Flex direction="column" gap="1rem">
              <Flex gap="1rem">
                <AiOutlineStop fontSize={'24px'} />
                <Box borderBottom="2px solid rgba(0,0,0,0.08)" width="100%">
                  <Text>{t('Block')}</Text>
                </Box>
              </Flex>
            </Flex>
          </Button>
          <Button
            display={'block'}
            textAlign="left"
            bg="none"
            padding="1rem"
            height="60px"
            rounded="none"
            fontWeight={'normal'}
          >
            <Flex direction="column" gap="1rem">
              <Flex gap="1rem">
                <MdOutlineReportGmailerrorred fontSize={'24px'} />
                <Box borderBottom="2px solid rgba(0,0,0,0.08)" width="100%">
                  <Text>{t('Report')}</Text>
                </Box>
              </Flex>
            </Flex>
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
