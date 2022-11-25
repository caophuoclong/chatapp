import { Stack, Switch, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as US } from '~/assets/icons/US.svg';
import { ReactComponent as VN } from '~/assets/icons/VN.svg';
import moment from 'moment';
import 'moment/locale/vi';
import { setDefaultLocale } from 'react-datepicker';
import { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import vi from 'date-fns/locale/vi';
import { useAppDispatch } from '~/app/hooks';
import { handleChangeLanguage } from '~/app/slices/global.slice';
import { useAppSelector } from '../../app/hooks';
type Props = {};

export default function ChangeLanguage({}: Props) {
  const lan = useAppSelector((state) => state.globalSlice.lan);
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(lan);
    window.localStorage.setItem('lan', lan);
    moment.locale(lan === 'vn' ? 'vi' : 'es');
  }, [lan]);
  return (
    <Stack direction={'row'} zIndex={1000}>
      <Text>{t('Language')}</Text>
      <VN width={32} height={24} />
      <Switch
        isChecked={lan === 'en'}
        onChange={() => {
          if (lan === 'en') {
            dispatch(handleChangeLanguage('vn'));
          } else {
            dispatch(handleChangeLanguage('en'));
          }
        }}
      />
      <US width={32} height={24} radius="10px" />
    </Stack>
  );
}
