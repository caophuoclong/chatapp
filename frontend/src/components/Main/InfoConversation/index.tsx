import React from 'react';
import {
  Avatar,
  AvatarBadge,
  Box,
  Flex,
  HStack,
  IconButton,
  StackDivider,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ArrowBackIcon, Search2Icon } from '@chakra-ui/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BsBellFill, BsBellSlashFill } from 'react-icons/bs';
import { useColorMode } from '@chakra-ui/react';
type Props = {};

export default function InfoConversation({}: Props) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();
  const { colorMode } = useColorMode();
  return (
    <Box
      width={{
        base: '100%',
      }}
      minHeight="60%"
      maxHeight="90%"
      boxSizing="border-box"
    >
      <Flex
        display={{
          base: 'flex',
          lg: 'none',
        }}
        paddingX="1rem"
        paddingY=".3rem"
        bg="blue.500"
        color="white"
        alignItems={'center'}
      >
        <IconButton
          bg="none"
          aria-label="Back to message"
          icon={<ArrowBackIcon fontSize={'24px'} />}
          onClick={() => {
            navigate(-1);
          }}
        />
        <Text fontWeight={600}>{t('Option')}</Text>
      </Flex>
      <Flex
        alignItems={'center'}
        justifyContent="center"
        direction={'column'}
        marginY="1rem"
      >
        <Avatar
          src="https://picsum.photos/200"
          width={{
            base: '56px',
            lg: '80px',
          }}
          height={{
            base: '56px',
            lg: '80px',
          }}
        >
          <AvatarBadge borderColor="papayawhip" bg="tomato" boxSize="1em" />
        </Avatar>
        <Box>
          <Text fontWeight={600} noOfLines={1}>
            Tran Cao Phuoc Long
          </Text>
        </Box>
      </Flex>
      <Flex alignItems="center" justifyContent={'center'} gap="1rem">
        <IconButton
          aria-label="Search message"
          rounded="full"
          icon={<Search2Icon />}
        />
        <IconButton
          aria-label="on/off noti"
          rounded="full"
          icon={<BsBellFill />}
        />
      </Flex>
      <VStack
        margin="1rem"
        align="stretch"
        divider={<StackDivider borderColor="gray.200" />}
      >
        <Box>
          <Text>123</Text>
          <Text>123</Text>
          <Text>123</Text>
        </Box>
        <Box>
          <Text>123</Text>
          <Text>123</Text>
          <Text>123</Text>
        </Box>
        <Box>
          <Text>123</Text>
          <Text>123</Text>
          <Text>123</Text>
        </Box>
      </VStack>
    </Box>
  );
}
