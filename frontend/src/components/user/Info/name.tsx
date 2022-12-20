import { Input, Tooltip, useColorMode } from '@chakra-ui/react';
import React from 'react';
import { useFormContext, useFormState } from 'react-hook-form';

type Props = {
  isEnableInput: boolean;
};

export default function Name({ isEnableInput }: Props) {
  const { register } = useFormContext();
  const { errors } = useFormState();
  const { colorMode } = useColorMode();
  return (
    <Tooltip
      hasArrow
      label={errors.name?.message?.toString()}
      isOpen={errors.name ? true : false}
      placement="top-end"
    >
      <Input
        disabled={!isEnableInput}
        _disabled={{
          color: colorMode === 'light' ? 'black' : 'white',
        }}
        textAlign={'center'}
        variant="unstyled"
        border={'none'}
        {...register('name')}
      />
    </Tooltip>
  );
}
