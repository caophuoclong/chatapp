import { Flex, Text, useColorMode } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
};

export default function Function({ icon, title, onClick }: Props) {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();
  return (
    <Flex
      onClick={onClick}
      width="100%"
      rounded={'md'}
      alignItems={'center'}
      gap={0.5}
      paddingY="1.5"
      paddingX="1"
      _hover={{
        backgroundColor: colorMode === 'dark' ? '#1A202C' : 'gray.300',
      }}
    >
      {icon}
      <Text fontSize={16}>{t(title)}</Text>
    </Flex>
  );
}
