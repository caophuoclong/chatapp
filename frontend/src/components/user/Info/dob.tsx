import { Flex, Input, Text, Tooltip, useColorMode } from '@chakra-ui/react';
import React from 'react';
import { useFormContext, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type Props = {
  isEnableInput: boolean;
};

export default function DOB({ isEnableInput }: Props) {
  const { register } = useFormContext();
  const { errors } = useFormState();
  const { t } = useTranslation();

  return (
    <Flex alignItems="center" height="fit-content" width="100%" gap="1rem">
      <Text fontWeight={700} minWidth="120px">
        {t('DOB')}
      </Text>
      <Flex gap=".5rem">
        <Tooltip
          hasArrow
          label={errors.date?.message?.toString()}
          isOpen={errors.date && !errors.month && !errors.year ? true : false}
          placement="top"
        >
          <Input
            w="30px"
            type="number"
            disabled={!isEnableInput}
            variant={'unstyled'}
            placeholder="dd"
            {...register('date')}
          />
        </Tooltip>
        /
        <Tooltip
          hasArrow
          label={errors.month?.message?.toString()}
          isOpen={errors.month && !errors.year ? true : false}
          placement="top-end"
        >
          <Input
            w="30px"
            type="number"
            disabled={!isEnableInput}
            variant={'unstyled'}
            placeholder="mm"
            max={12}
            {...register('month')}
          />
        </Tooltip>
        /
        <Tooltip
          hasArrow
          label={errors.year?.message?.toString()}
          isOpen={errors.year ? true : false}
          placement="top-end"
        >
          <Input
            w="15%"
            type="number"
            disabled={!isEnableInput}
            variant={'unstyled'}
            placeholder="yyyy"
            {...register('year')}
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
}
