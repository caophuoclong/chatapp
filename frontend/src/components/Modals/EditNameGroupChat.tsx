import {
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
  useToast,
} from '@chakra-ui/react';
import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import ConversationsApi from '../../services/apis/Conversations.api';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { updateConversation } from '~/app/slices/conversations.slice';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode[];
  groupName: string;
  onChangeGroupName: (groupName: string) => void;
  _id: string;
};

export default function EditNameGroupChat({
  isOpen,
  onClose,
  children,
  groupName,
  onChangeGroupName,
  _id,
}: Props) {
  const { t } = useTranslation();
  const toast = useToast();
  function autoSelect(e: React.FocusEvent<HTMLInputElement>) {
    e.target.select();
  }
  const conversations = useAppSelector(
    (state) => state.conversationsSlice.conversations
  );
  const conversation = conversations.find((c) => c._id === _id);
  const dispatch = useAppDispatch();

  async function onUpdateGroupName(e: React.MouseEvent<HTMLButtonElement>) {
    try {
      const res = await ConversationsApi.changeGroupName(_id, groupName);
      const { data } = res;
      if (data.statusCode === 200) {
        if (conversation) {
          const tempConverstaion = { ...conversation, name: groupName };
          dispatch(updateConversation(tempConverstaion));
        }
        toast({
          title: t('Success'),
          description: t('Update__Group__Name__Successfully'),
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: t('Fail'),
        description: t('Update__Group__Name__Fail'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.log(error);
    }
    setTimeout(() => {
      onClose();
    }, 500);
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent marginY={'auto'}>
        <ModalHeader borderBottom="1px solid black">
          {t('Change__Group__Name')}
        </ModalHeader>
        <ModalBody>
          <Flex justifyContent={'center'}>{children[0]}</Flex>
          {t('Confirm__Change__Group__Name')}
          <Input
            value={groupName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              onChangeGroupName(e.target.value);
            }}
            autoFocus
            onFocus={autoSelect}
          />
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={onClose}>
            {t('Close')}
          </Button>
          <Button colorScheme={'blue'} onClick={onUpdateGroupName}>
            {t('Confirm')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
