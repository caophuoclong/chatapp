import { Flex, Input, Tooltip } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useAppSelector } from '~/app/hooks';
import { useTranslation } from 'react-i18next';

type Props = {
  placeholder?: string | '';
  name: string;
  onChange?: (s: string) => void;
  icon: JSX.Element;
  // any props
  [key: string]: any;
  type?: string | '';
  isError?: boolean;
  labelError?: string;
};

export default function MyInput({
  placeholder,
  icon,
  name,
  type,
  isError,
  labelError,
}: Props) {
  const { register } = useFormContext();
  const { t } = useTranslation();
  return (
    <Tooltip
      hasArrow
      label={labelError ? t(labelError) : ''}
      isOpen={isError}
      placement="top-end"
    >
      <Flex
        position={'relative'}
        paddingX="1rem"
        paddingY=".5rem"
        border="2px solid white"
        rounded="xl"
        _focusWithin={{
          borderColor: isError ? 'red.500' : 'blue.300',
        }}
        gap="1rem"
      >
        {icon}
        <Input
          placeholder={placeholder}
          autoComplete="off"
          {...register(name)}
          variant="unstyled"
          bg="none"
          fontSize={'19px'}
          fontWeight={700}
          type={type === undefined ? 'text' : type}
          _placeholder={{
            color: 'rgba(255,255,255,0.7)',
          }}
        />
      </Flex>
    </Tooltip>
  );
}
