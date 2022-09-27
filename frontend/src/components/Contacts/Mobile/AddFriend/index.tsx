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
        height="5%"
        gap="1rem"
        alignItems={'center'}
        paddingY=".5rem"
        boxShadow="rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px"
      >
        <IconButton
          aria-label="Back to contacts"
          variant={'unstyled'}
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
        <Text size="sm" fontWeight={'bold'} fontStyle="italic">
          {t('Username')}
        </Text>
        <Flex justifyContent={'center'} alignItems={'center'}>
          <Input
            variant={'unstyled'}
            fontSize={'1.2rem'}
            padding=".5rem"
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
            // fontSize={'12px'}
            // padding="0"
            height="40px"
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
