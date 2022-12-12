import { Box, Flex, IconButton, Image } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { GrNext, GrPrevious } from 'react-icons/gr';
import { useAppSelector } from '~/app/hooks';
import { IMessage } from '../../../../interfaces/IMessage';
import loading from '~/assets/images/loading.gif';
import { renderAvatar } from '~/utils/renderAvatar';
type Props = {
  handleChange: (message: IMessage) => void;
  initMessage?: string;
};
const ImageCarousel: React.FC<Props> = ({ handleChange, initMessage }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const carouselItemsRef = useRef<HTMLDivElement[] | null[]>([]);
  const isLoading = useAppSelector(
    (state) => state.messageSlice.isLoading.messagesImages
  );
  const choosenConversation = useAppSelector(
    (state) => state.globalSlice.conversation.choosenConversationID
  );
  const messagesImage = useAppSelector(
    (state) => state.messageSlice.messagesImages
  )[choosenConversation];
  const messages = messagesImage ? messagesImage.data : [];
  useEffect(() => {
    if (messages) {
      const idx = messages.findIndex((m) => m._id === initMessage);
      if (idx !== -1) {
        carouselItemsRef.current = carouselItemsRef.current.slice(
          0,
          messages.length
        );
        setSelectedImageIndex(idx);
      }
    }
    return () => {
      carouselItemsRef.current = [];
      setSelectedImageIndex(0);
    };
  }, [messages]);
  useEffect(() => {
    if (carouselItemsRef?.current[selectedImageIndex]) {
      carouselItemsRef?.current[selectedImageIndex]?.scrollIntoView({
        inline: 'center',
        behavior: 'smooth',
      });
    }
    handleChange(messages[selectedImageIndex]);
  }, [selectedImageIndex]);
  const handleSelectedImageChange = (newIdx: number) => {
    if (messages && messages.length > 0) {
      handleChange(messages[newIdx]);
      setSelectedImageIndex(newIdx);
    }
  };

  const handleRightClick = () => {
    if (messages && messages.length > 0) {
      let newIdx = selectedImageIndex + 1;
      if (newIdx >= messages.length) {
        return;
      }
      setSelectedImageIndex(newIdx);
    }
  };

  const handleLeftClick = () => {
    if (messages && messages.length > 0) {
      let newIdx = selectedImageIndex - 1;
      if (newIdx < 0) {
        return;
      }
      setSelectedImageIndex(newIdx);
    }
  };

  return (
    <Box maxWidth={'50%'}>
      <Flex alignItems={'center'}>
        <IconButton
          aria-label="previous image"
          icon={<GrPrevious />}
          marginX="1rem"
          variant="ghost"
          onClick={handleLeftClick}
          disabled={isLoading}
        />

        <Flex gap="1rem" overflow={'hidden'}>
          {isLoading
            ? Array.from({ length: 10 }).map((item, idx) => (
                <Image
                  marginX="0"
                  key={idx}
                  src={loading}
                  alt="images"
                  w={'60px'}
                  h={'60px'}
                  rounded="lg"
                  loading="lazy"
                />
              ))
            : messages &&
              messages.map((message, idx) => (
                <Box
                  flex="0 0 60px"
                  key={message._id}
                  onClick={() => setSelectedImageIndex(idx)}
                  border={selectedImageIndex === idx ? '2px solid #89ff' : ''}
                  rounded="lg"
                  cursor={'pointer'}
                >
                  <Image
                    marginX="0"
                    key={idx}
                    scaleX="0.5"
                    src={renderAvatar(message ? message.content : '')}
                    alt="images"
                    w={'60px'}
                    h={'60px'}
                    rounded="lg"
                    loading="lazy"
                    ref={(el) => (carouselItemsRef.current[idx] = el)}
                  />
                </Box>
              ))}
        </Flex>

        <IconButton
          aria-label="next image"
          icon={<GrNext />}
          marginX="1rem"
          variant="ghost"
          onClick={handleRightClick}
          disabled={isLoading}
        />
      </Flex>
    </Box>
  );
};

export default ImageCarousel;
