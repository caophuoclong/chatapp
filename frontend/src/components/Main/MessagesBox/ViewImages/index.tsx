import {
  Flex,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { renderAvatar } from '../../../../utils/renderAvatar';
import { faker } from '@faker-js/faker';
import {
  IMessage,
  MessageStatusType,
  MessageType,
} from '../../../../interfaces/IMessage';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import ImageCarousel from './ImageCarousel';
import { getMessageTypeImage } from '~/app/slices/messages.slice';
import loading from '~/assets/images/loading.gif';
type Props = {
  isOpen: boolean;
  onClose: () => void;
  imagesClicked: string;
};

export default function ViewImages({ isOpen, onClose, imagesClicked }: Props) {
  const [messageList, setMessageList] = useState<Array<IMessage>>([]);
  const [messageShow, setMessageShow] = useState<IMessage>();
  const dispatch = useAppDispatch();
  const conversationId = useAppSelector(
    (state) => state.globalSlice.conversation.choosenConversationID
  );
  const user = useAppSelector((state) => state.userSlice.info);
  useEffect(() => {
    (async () => {
      const fakeListMessage = Array.from({ length: 30 }).map<IMessage>(() => ({
        _id: faker.datatype.uuid(),
        content: faker.image.avatar(),
        createdAt: faker.date.past().getTime(),
        type: MessageType.IMAGE,
        destination: faker.datatype.uuid(),
        isRecall: false,
        sender: user,
        status: MessageStatusType.SENT,
        isDeleted: false,
        scale: 1,
        parentMessage: null,
      }));
      setMessageList(fakeListMessage);
    })();
  }, []);
  const isLoading = useAppSelector(
    (state) => state.messageSlice.isLoading.messagesImages
  );
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      blockScrollOnMount={true}
      size={'full'}
    >
      <ModalOverlay backdropFilter="blur(5px) grayscale(30%)" />
      <ModalContent bg={'transparent'}>
        <ModalCloseButton />
        <ModalBody flex={1} paddingY="1rem">
          {isLoading ? (
            <Image
              rounded="md"
              maxHeight={'700px'}
              src={loading}
              alt="images"
              marginX="auto"
            />
          ) : (
            <Image
              rounded="md"
              maxHeight={'700px'}
              src={renderAvatar(messageShow ? messageShow.content : '')}
              alt="images"
              marginX="auto"
            />
          )}
        </ModalBody>
        <ModalFooter justifyContent={'center'}>
          <ImageCarousel
            handleChange={(message) => setMessageShow(message)}
            initMessage={imagesClicked}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
