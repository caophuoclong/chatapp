import { CheckCircleIcon } from '@chakra-ui/icons';
import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  atLeast: boolean;
  atLeastUpper: boolean;
  atLeastNum: boolean;
  atLeastSpecial: boolean;
};

export default function ShowErrorPerChar({
  atLeast,
  atLeastNum,
  atLeastSpecial,
  atLeastUpper,
}: Props) {
  const { t } = useTranslation();
  return (
    <Box width="100%">
      <Flex
        color={atLeast ? 'green.300' : 'gray.300'}
        gap=".2rem"
        alignItems={'center'}
      >
        <CheckCircleIcon />
        <Text>{t('At__Least__8')}</Text>
      </Flex>
      <Flex
        color={atLeastUpper ? 'green.300' : 'gray.300'}
        gap=".2rem"
        alignItems={'center'}
      >
        <CheckCircleIcon />
        <Text>{t('At__Least__Upper')}</Text>
      </Flex>
      <Flex
        color={atLeastNum ? 'green.300' : 'gray.300'}
        gap=".2rem"
        alignItems={'center'}
      >
        <CheckCircleIcon />
        <Text>{t('At__Least__Num')}</Text>
      </Flex>
      <Flex
        color={atLeastSpecial ? 'green.300' : 'gray.300'}
        gap=".2rem"
        alignItems={'center'}
      >
        <CheckCircleIcon />
        <Text>{t('At__Least__Special')}</Text>
      </Flex>
    </Box>
  );
}
