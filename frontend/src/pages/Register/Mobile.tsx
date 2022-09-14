import { Box, Button, Flex, Text, useToast } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import MyInput from '~/components/MyInput';
import { FormProvider, useForm } from 'react-hook-form';
import { FaUser } from 'react-icons/fa';
import { BsKey } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import background from '~/assets/images/bg_login.png';
import ChangeLanguage from '../../components/Settings/ChangeLanguage';
import { MdEmail } from 'react-icons/md';
import { IRegisterRequest } from '~/interfaces/IRegister';

type Props = {
  onSubmit: (data: IRegisterRequest) => void;
};

export default function Mobile({ onSubmit }: Props) {
  const { t } = useTranslation();
  const methods = useForm<IRegisterRequest>({});

  return (
    <FormProvider {...methods}>
      <Box
        bg="none"
        position="absolute"
        right="0"
        margin="1rem"
        zIndex={50}
        color="white"
      >
        <ChangeLanguage />
      </Box>
      <Box
        width="100vw"
        height="100vh"
        position="relative"
        bg=" #1F41A9"
        style={{
          backgroundImage: `url(${background})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <Flex
          justifyContent={'center'}
          direction="column"
          alignItems={'center'}
          position="absolute"
          top="50%"
          transform={'translateY(-50%)'}
          width="100%"
        >
          <Box marginY="40px">
            <Text
              textAlign={'center'}
              fontSize="48px"
              fontWeight={700}
              color="white"
            >
              {t('Register')}
            </Text>
            {/* <Text fontWeight={700} color="white" fontSize={'18px'}>
              {t('Details__Login')}
            </Text> */}
          </Box>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Flex direction={'column'} gap="20px" color="white">
              <MyInput
                icon={<FaUser size="34px" />}
                name="name"
                placeholder={t('Name')}
              />
              <MyInput
                icon={<FaUser size="34px" />}
                name="username"
                placeholder={t('Username')}
              />
              <MyInput
                icon={<MdEmail size="34px" />}
                name="email"
                placeholder={t('Email')}
              />
              <MyInput
                icon={<BsKey size="34px" />}
                name="password"
                type="password"
                placeholder={t('Password')}
              />
              <MyInput
                icon={<BsKey size="34px" />}
                name="configmPassword"
                type="password"
                placeholder={t('Confirm__Password')}
              />
              {/* <Link to="/forgot-password">
                <Text fontSize={12} textAlign="right">
                  {t('Forgot__Password')}
                </Text>
              </Link> */}
              <Button
                type="submit"
                bg="none"
                borderRadius={'15px'}
                color="#00FF29"
                border="2px solid #00FF29"
                _hover={{
                  bg: 'none',
                }}
              >
                {t('Register')}
              </Button>
            </Flex>
          </form>
          <Flex
            marginY="1rem"
            justifyContent={'center'}
            gap="3px"
            color="white"
          >
            <Text>{t('Already__User')}</Text>
            <Link to="/login">
              <Text fontStyle={'italic'} color="#318ABC">
                {t('Login')}
              </Text>
            </Link>
          </Flex>
        </Flex>
      </Box>
    </FormProvider>
  );
}
