import React from 'react';
import { Stack, Switch, Text, useColorMode } from '@chakra-ui/react';
import { MdDarkMode, MdWbSunny } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
type Props = {};

export default function ToggleTheme({}: Props) {
  const { colorMode, toggleColorMode } = useColorMode();
  const { t } = useTranslation();
  return (
    <Stack direction={'row'}>
      <Text>{t('Theme')}</Text>
      <MdWbSunny />
      <Switch isChecked={colorMode === 'dark'} onChange={toggleColorMode} />
      <MdDarkMode />
    </Stack>
  );
}
