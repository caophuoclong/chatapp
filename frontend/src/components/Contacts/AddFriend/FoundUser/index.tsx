import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiMoreHorizontal } from 'react-icons/fi';
import MoreActionModal from './MoreActionModal';
import { AiOutlineMessage, AiOutlineUserAdd } from 'react-icons/ai';

type Props = {};

export default function FoundUser({}: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showMoreAction, setShowMoreAction] = React.useState(false);
  return (
    <Flex direction={'column'} position="relative">
      <Flex
        gap="1rem"
        alignItems={'center'}
        paddingY=".5rem"
        bg="none"
        position={'fixed'}
        width="100%"
      >
        <IconButton
          aria-label="Back to contacts"
          bg="none"
          fontSize={'24px'}
          color="white"
          icon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        />
        <IconButton
          aria-label="more action"
          bg="none"
          fontSize={'24px'}
          color="white"
          marginLeft="auto"
          onClick={() => setShowMoreAction(true)}
          icon={<FiMoreHorizontal />}
        />
      </Flex>
      {/* Profile photo  */}
      <Box height="200px">
        {/* Cover */}
        <Box width="full">
          <Image
            src="https://picsum.photos/130"
            alt=""
            width="100%"
            height="150px"
          />
        </Box>
        {/* Name and avatar */}
        <Flex
          justifyContent={'center'}
          alignItems="center"
          direction={'column'}
          position="relative"
          transform={'translateY(-32px)'}
        >
          <Avatar src="https://picsum.photos/200" size="lg" />
          <Text fontWeight={700}> Poohuoc long</Text>
        </Flex>
      </Box>
      <Flex gap="1rem" justifyContent={'center'} marginY="1rem" paddingX="1rem">
        <IconButton
          aria-label="Message"
          bg="blue.300"
          width="100%"
          _hover={{
            bg: 'blue.500',
          }}
          _active={{
            bg: 'blue.500',
          }}
          fontSize={'18px'}
          icon={
            <Flex gap=".5rem">
              <AiOutlineMessage />
              {t('Message')}
            </Flex>
          }
        />
        <IconButton
          aria-label="add"
          _dark={{
            bg: 'white',
            color: 'black',
          }}
          bg="white"
          color="black"
          fontSize={'18px'}
          icon={<AiOutlineUserAdd />}
        />
      </Flex>
      {showMoreAction && (
        <MoreActionModal setShow={() => setShowMoreAction(false)} />
      )}
    </Flex>
  );
}
