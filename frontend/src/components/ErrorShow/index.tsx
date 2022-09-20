import { Text } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  children: string;
};

export default function ErrorShow({ children }: Props) {
  const { t } = useTranslation();
  return (
    <>
      {new RegExp(/Required/).test(children) ? (
        <Text fontSize={13} color="red">
          {t(children)}
        </Text>
      ) : (
        <Text fontSize={13} color="#f4932e">
          {t(children)}
        </Text>
      )}
    </>
  );
}
