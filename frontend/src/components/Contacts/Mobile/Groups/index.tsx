import React from 'react';
import { Button, Flex, Box, Text, useColorMode } from '@chakra-ui/react';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { useTranslation } from 'react-i18next';
import Group from './Group';
import { useNavigate } from 'react-router-dom';

type Props = {};

export default function Groups({}: Props) {
  const { colorMode } = useColorMode();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleCreateGroup = () => {
    navigate('/newgroup');
  };
  return (
    <Flex direction={'column'}>
      <Flex
        as={'button'}
        justifyContent="flex-start"
        alignItems={'center'}
        width="100%"
        // padding="0"
        padding="1rem"
        bg="none"
        _active={{
          bg: 'none',
        }}
        _hover={{
          bg: 'none',
        }}
        boxSizing="border-box"
        gap="1rem"
        onClick={handleCreateGroup}
      >
        <Box
          width="48px"
          height="48px"
          boxSizing="border-box"
          rounded="100%"
          padding="8px"
          color="blue.400"
          bg={colorMode === 'dark' ? 'gray.600' : 'blue.100'}
        >
          <AiOutlineUsergroupAdd size="36px" />
        </Box>
        <Text fontWeight={600}>{t('Create__New__Group')}</Text>
      </Flex>
      <Box
        height="5px"
        bg={colorMode === 'dark' ? 'blackAlpha.700' : 'blackAlpha.200'}
      ></Box>
      <Flex direction="column" paddingY=".5rem" gap=".5rem">
        <Text paddingX="1rem" fontWeight={600}>
          {t('Group__Joined')} (4)
        </Text>
        <Group />
        <Group />
        <Group />
        <Group />
        <Group />
        <Group />
        <Group />
      </Flex>
    </Flex>
  );
}
