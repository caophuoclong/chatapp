import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  Flex,
  Box,
  Avatar,
  Text,
  IconButton,
  AvatarBadge,
  useColorMode,
} from '@chakra-ui/react';
import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BsCameraVideoFill } from 'react-icons/bs';
import { IoCallSharp } from 'react-icons/io5';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { GiHamburgerMenu } from 'react-icons/gi';
import {
  setShowInfoConversation,
  setChoosenConversationID,
} from '~/app/slices/global.slice';
type Props = {};

export default function Header({}: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const showInfo = useAppSelector(
    (state) => state.globalSlice.conversation.showInfoConversation
  );
  const dispatch = useAppDispatch();
  const { colorMode } = useColorMode();
  return (
    <Flex
      boxSizing="border-box"
      minHeight={{
        base: '6%',
        lg: '5%',
      }}
      alignItems="center"
      justifyContent={'flex-start'}
      paddingX="1rem"
      paddingY=".3rem"
      borderBottom={
        colorMode === 'dark'
          ? '1px solid rgba(255, 255, 255,0.3)'
          : '1px solid  rgba(0, 0, 0, 0.08)'
      }
    >
      <ArrowBackIcon
        fontSize={'1.5rem'}
        display={{
          base: 'block',
          lg: 'none',
        }}
        onClick={() => {
          dispatch(setChoosenConversationID(''));
        }}
      />
      <Avatar
        width="40px"
        height="40px"
        display={{
          base: 'none',
          lg: 'block',
        }}
      >
        <AvatarBadge borderColor="papayawhip" bg="tomato" boxSize="1em" />
      </Avatar>
      <Box marginX="1rem">
        <Text fontWeight={600} noOfLines={1}>
          Tran Cao Phuoc Long
        </Text>
        <Text fontSize={'12px'}>
          {(t('LastActive') as (time: string | number) => String)(5)}
        </Text>
      </Box>
      <Flex marginLeft="auto" gap=".4rem">
        <IconButton
          bg="none"
          rounded="full"
          aria-label="Call video"
          icon={<BsCameraVideoFill />}
        />
        <IconButton
          bg="none"
          rounded="full"
          aria-label="Call"
          icon={<IoCallSharp />}
        />
        <IconButton
          onClick={() => {
            dispatch(setShowInfoConversation(true));
          }}
          bg={
            showInfo ? (colorMode === 'dark' ? 'gray.700' : 'gray.200') : 'none'
          }
          rounded="full"
          aria-label="Show infor conversations"
          icon={<GiHamburgerMenu />}
        />
      </Flex>
    </Flex>
  );
}
