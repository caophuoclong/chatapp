import { Flex, Input, Text, Tooltip, useColorMode } from '@chakra-ui/react';
import React from 'react';
import { useFormContext, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type Props = {
  isEnableInput: boolean;
};

export default function Email({ isEnableInput }: Props) {
  const { register } = useFormContext();
  const { t } = useTranslation();
  const { errors } = useFormState();
  const { colorMode } = useColorMode();
  return (
    <Flex alignItems="center" height="fit-content" width="100%" gap="1rem">
      <Text fontWeight={700} minWidth="120px">
        {t('Email')}
      </Text>
      <Tooltip
        hasArrow
        label={errors.email?.message?.toString()}
        isOpen={errors.email ? true : false}
        placement="top-end"
      >
        <Input
          className="input__info"
          disabled={!isEnableInput}
          _disabled={{
            color: colorMode === 'light' ? 'black' : 'white',
          }}
          outline="none"
          border={'none'}
          variant="unstyled"
          {...register('email')}
        />
      </Tooltip>
    </Flex>
  );
}
