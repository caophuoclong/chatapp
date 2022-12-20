import {
  Flex,
  HStack,
  Radio,
  RadioGroup,
  Text,
  useFormControl,
} from '@chakra-ui/react';
import React from 'react';
import { Controller, useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type Props = {
  isEnableInput: boolean;
  control: any;
  name: string;
};

export default function Gender({ isEnableInput, control, name }: Props) {
  const { field } = useController({
    control,
    name,
    rules: { required: true },
  });
  const { t } = useTranslation();
  return (
    <Flex alignItems="center" height="fit-content" width="100%" gap="1rem">
      <Text fontWeight={700} minWidth="120px">
        {t('Gender')}
      </Text>
      <RadioGroup isDisabled={!isEnableInput} {...field}>
        <HStack gap="1rem">
          <Radio value="male">{t('Male')}</Radio>
          <Radio value="female">{t('Female')}</Radio>
          <Radio value="other">{t('Other')}</Radio>
        </HStack>
      </RadioGroup>
    </Flex>
  );
}
