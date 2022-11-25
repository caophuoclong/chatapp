import { Box, IconButton, Input, InputGroup } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { SearchIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';
type Props = {};

export default function SearchBar({}: Props) {
  const { t, i18n } = useTranslation();
  const [value, setValue] = React.useState('');
  const handleOnEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      console.log(value);
    }
  };
  const handleOnSearchClick = () => {
    console.log(value);
  };
  return (
    <InputGroup
      padding={'10px 5px'}
      rounded={'2xl'}
      bg="gray.200"
      _dark={{
        bg: 'gray.700',
      }}
    >
      <IconButton
        height={'20px'}
        _hover={{
          bg: 'none',
        }}
        margin="0"
        bg={'none'}
        onClick={handleOnSearchClick}
        aria-label="Searh message or user"
        icon={<SearchIcon />}
      />
      <Input
        height="20px"
        padding={0}
        focusBorderColor={'none'}
        bg="transparent"
        placeholder={t('Search')}
        border="none"
        onKeyDown={handleOnEnter}
        value={value}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setValue(event.target.value);
        }}
      />
    </InputGroup>
  );
}
