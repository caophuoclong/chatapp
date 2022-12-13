import { IconButton, useColorMode } from '@chakra-ui/react';
import React from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { setShowInfoConversation } from '~/app/slices/global.slice';

type Props = {};

export default function ShowMoreConversation({}: Props) {
  const isShowInfoConversation = useAppSelector(
    (state) => state.globalSlice.conversation.showInfoConversation
  );
  const { colorMode } = useColorMode();
  const dispatch = useAppDispatch();
  return (
    <React.Fragment>
      <IconButton
        onClick={() => {
          dispatch(setShowInfoConversation(true));
        }}
        bg={
          isShowInfoConversation
            ? colorMode === 'dark'
              ? 'gray.700'
              : 'gray.200'
            : 'none'
        }
        rounded="full"
        aria-label="Show infor conversations"
        icon={<GiHamburgerMenu />}
      />
    </React.Fragment>
  );
}
