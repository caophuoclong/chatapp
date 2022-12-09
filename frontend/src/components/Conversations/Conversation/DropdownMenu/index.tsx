import {
  Box,
  Button,
  Flex,
  HStack,
  useColorMode,
  useToast,
  VStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Dialog from './Dialog';
import { MdBlock, MdCheck, MdReportProblem } from 'react-icons/md';
import { IoMdTrash } from 'react-icons/io';
import Function from './Function';
import ConversationsApi from '../../../../services/apis/Conversations.api';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import {
  initMessage,
  removeMessageFromMessages,
} from '~/app/slices/messages.slice';
import { removeConversation } from '~/app/slices/conversations.slice';
import { SocketEvent } from '~/constants/socketEvent';
export type DialogType = 'delete_conversation' | '';
type Props = {
  isOpen: boolean;
  onClose: () => void;
  _id: string;
};

export default function DropDownMenu({ isOpen, onClose, _id }: Props) {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { t } = useTranslation();
  const socket = useAppSelector((state) => state.globalSlice.socket);
  const isLargerThanHD = useAppSelector(
    (state) => state.globalSlice.isLargerThanHD
  );
  const ref = React.useRef<HTMLDivElement>(null);
  const [orientation, setOrientation] = useState<'up' | 'down'>('up');
  const { colorMode } = useColorMode();
  const [dialog, setDialog] = useState({
    isOpen: false,
    title: '',
    content: '',
    type: '' as DialogType,
  });
  const [showDialogDeleteConversation, setShowDialogDeleteConversation] =
    useState(false);

  const setHideDialog = () => {
    setDialog({
      isOpen: false,
      title: '',
      content: '',
      type: '',
    });
  };
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const s = document.querySelector("[id*='chakra-modal']") as Node;
      if (ref.current && !ref.current.contains(event.target as Node) && !s) {
        onClose();
        setHideDialog();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
  useEffect(() => {
    const current = ref.current;
    if (current) {
      //  detect when dropdown out of screen
      const rect = current.getBoundingClientRect();
      const { top, bottom } = rect;
      console.log(top);
      if (top - 50 < 0) {
        setOrientation('up');
      } else if (bottom + 50 > window.innerHeight) {
        setOrientation('down');
      }
    }
  }, [isOpen, ref]);
  const onDeleteConversation = async () => {
    setDialog({
      isOpen: true,
      title: 'Delete__Conversation',
      content: 'Alert__Sure__Delete__Conversation',
      type: 'delete_conversation',
    });
  };
  const onConfirm = async (type: DialogType) => {
    try {
      switch (type) {
        case 'delete_conversation':
          const response = await ConversationsApi.deleteConversation(_id);
          const { data } = response;
          if (data.statusCode !== 200) {
            toast({
              title: t('Error'),
              description: t('Error__Delete__Conversation'),
              status: 'error',
              position: isLargerThanHD ? 'top-right' : 'bottom',
              duration: 1000,
            });
          } else {
            const response = await ConversationsApi.deleteConversation(_id);
            console.log(response);
            dispatch(removeMessageFromMessages(_id));
            dispatch(removeConversation(_id));
            toast({
              title: t('Success'),
              description: t('Success__Delete__Conversation'),
              status: 'success',
              position: isLargerThanHD ? 'top-right' : 'bottom',
              duration: 1000,
            });
          }
          break;
        default:
          break;
      }
    } catch (error) {
      toast({
        title: t('Error'),
        description: t('Something__Wrong'),
        status: 'error',
        position: isLargerThanHD ? 'top-right' : 'bottom',
        duration: 1000,
      });
    }
    handleCloseAll();
  };
  const onMakeUnReadConversation = async () => {};
  const onReport = async () => {};
  const onBlock = async () => {};
  //   check distance between bottom of dropdown menu and bottom of screen
  const handleCloseAll = () => {
    onClose();
    setHideDialog();
  };
  return isOpen ? (
    <Flex
      ref={ref}
      bg={colorMode === 'dark' ? '#2D3748' : '#fff'}
      rounded="md"
      position="absolute"
      zIndex={1000}
      padding={2}
      direction={'column'}
      boxSizing="border-box"
      width="100%"
      gap=".5rem"
      transform={
        orientation === 'down' ? 'translateY(-160px)' : 'translateY(80px)'
      }
      boxShadow="rgba(0, 0, 0, 0.35) 0px 5px 15px"
      // render triangle
      _before={{
        content: '""',
        position: 'absolute',
        top: orientation === 'up' ? 'auto' : '100%',
        bottom: orientation === 'down' ? 'auto' : '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 0,
        height: 0,
        borderLeft: '8px solid transparent',
        borderRight: '8px solid transparent',
        borderTop:
          orientation === 'down'
            ? `8px solid ${colorMode === 'dark' ? '#2d3748' : '#fff'}`
            : 'auto',
        borderBottom:
          orientation === 'up'
            ? `8px solid ${colorMode === 'dark' ? '#2d3748' : '#fff'}`
            : 'auto',
      }}
    >
      <VStack
        alignItems={'flex-start'}
        spacing="2"
        borderBottom={
          colorMode === 'dark'
            ? '1px solid rgba(255, 255, 255,0.3)'
            : '1px solid  rgba(0, 0, 0, 0.08)'
        }
      >
        <Function
          icon={<MdCheck size={16} />}
          title={'Mark__Un__Read'}
          onClick={onMakeUnReadConversation}
        />
      </VStack>
      <VStack alignItems={'flex-start'} spacing="2">
        <Function
          icon={<IoMdTrash size={16} />}
          title={'Delete__Conversation'}
          onClick={onDeleteConversation}
        />
        <Function
          icon={<MdBlock size={16} />}
          title={'Block'}
          onClick={onBlock}
        />
        <Function
          icon={<MdReportProblem size={16} />}
          title={'Report'}
          onClick={onReport}
        />
      </VStack>

      <Dialog
        isOpen={dialog.isOpen}
        onClose={handleCloseAll}
        title={dialog.title}
        content={dialog.content}
        type={dialog.type}
        onConfirm={onConfirm}
      />
    </Flex>
  ) : null;
}
