import React from 'react';
import { Flex, IconButton, Text, VStack } from '@chakra-ui/react';
import { MdOutlineMoreHoriz, MdSettings } from 'react-icons/md';
import SettingModal from '../../Modals/SettingModal';

type Props = {};

export default function FunctionBar({}: Props) {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Flex
      display={{
        base: 'none',
        lg: 'flex',
      }}
      width="100%"
      alignItems="center"
    >
      <Text fontWeight={600}>Chats</Text>
      <Flex marginLeft="auto">
        <IconButton
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          aria-label="show more settings"
          icon={<MdSettings />}
        />
      </Flex>
      <SettingModal
        isOpen={isOpen}
        onClose={(x: boolean) => {
          setIsOpen(x);
        }}
      />
    </Flex>
  );
}
