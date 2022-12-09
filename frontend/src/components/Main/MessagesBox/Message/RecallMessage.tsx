import { Box, useColorMode } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  other?: boolean;
  isLast?: boolean;
  isRecall: boolean;
};

export default function RecallMessage({ other, isLast, isRecall }: Props) {
  const { colorMode } = useColorMode();
  const { t } = useTranslation();
  return (
    <Box
      marginRight={other ? 'none' : '.5rem'}
      marginLeft={other ? '.5rem' : 'none'}
      fontSize={'16px'}
      wordBreak="break-word"
      padding=".5rem"
      rounded="lg"
      roundedBottomRight={!other && isLast ? 'none' : 'lg'}
      roundedBottomLeft={other && isLast ? 'none' : 'lg'}
      whiteSpace={'pre-wrap'}
      color={isRecall ? 'gray.500' : colorMode === 'light' ? 'black' : 'white'}
      bg={
        isRecall
          ? colorMode === 'light'
            ? other
              ? 'gray.300'
              : 'blue.300'
            : other
            ? 'gray.700'
            : 'purple.600'
          : 'none'
      }
    >
      {t('This__Message__HasBeen__Recalled')}
    </Box>
  );
}
