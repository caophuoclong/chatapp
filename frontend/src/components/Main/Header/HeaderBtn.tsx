import { Flex, IconButton, useColorMode } from '@chakra-ui/react';
import React from 'react';
import { BsCameraVideoFill } from 'react-icons/bs';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoCallSharp } from 'react-icons/io5';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { setShowInfoConversation } from '~/app/slices/global.slice';

type Props = {};

export default function HeaderBtn({}: Props) {
  const showInfo = useAppSelector(
    (state) => state.globalSlice.conversation.showInfoConversation
  );
  const { colorMode } = useColorMode();
  const dispatch = useAppDispatch();
  return (
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
  );
}
