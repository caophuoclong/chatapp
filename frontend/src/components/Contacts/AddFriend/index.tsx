import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, IconButton, Input, Text } from '@chakra-ui/react';
import React, { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type Props = {};

export default function AddFriend({}: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [serachUser, setSearchUser] = useState('');
  const handleSubmitSearch = () => {
    navigate(`/contacts/add/${serachUser}`);
  };
  return (
    <Flex direction={'column'} height="100vh">
      <Flex
        gap="1rem"
        alignItems={'center'}
        paddingY=".5rem"
        bg="blue.500"
        color="white"
      >
        <IconButton
          aria-label="Back to contacts"
          bg="none"
          fontSize={'24px'}
          icon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        />
        <Text fontWeight={600}>{t('AddFriend')}</Text>
      </Flex>
      <Box
        rounded={'lg'}
        padding="0.2rem .5rem"
        border="1px solid rgba(0,0,0,0.08)"
        margin="1rem"
        _focusWithin={{
          borderColor: 'blue.500',
        }}
      >
        <Text size="sm">{t('Username')}</Text>
        <Flex>
          <Input
            variant={'unstyled'}
            paddingX=".5rem"
            value={serachUser}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchUser(e.target.value)
            }
          />
          <Button
            aria-label="Search friend"
            bg="blue.500"
            _hover={{
              bg: 'blue.500',
            }}
            _active={{
              bg: 'blue.700',
            }}
            fontSize={'12px'}
            padding="0"
            height="20px"
            color="white"
            onClick={handleSubmitSearch}
          >
            {t('Search_second')}
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}
