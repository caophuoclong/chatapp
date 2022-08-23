import { Flex, Input } from '@chakra-ui/react';
import React from 'react';
import { useFormContext } from 'react-hook-form';

type Props = {
  placeholder?: string | '';
  name: string;
  onChange?: (s: string) => void;
  icon: JSX.Element;
  // any props
  [key: string]: any;
  type?: string | '';
};

export default function MyInput({ placeholder, icon, name, type }: Props) {
  const { register } = useFormContext();
  return (
    <Flex
      paddingX="1rem"
      paddingY=".5rem"
      border="2px solid white"
      rounded="xl"
      _focusWithin={{
        borderColor: 'red.500',
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
  );
}
