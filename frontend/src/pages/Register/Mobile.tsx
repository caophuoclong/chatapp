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
import { EmailIcon } from '@chakra-ui/icons';
import { MdEmail } from 'react-icons/md';
import Auth from '~/services/apis/Auth.api';
import { IRegisterRequest } from '~/interfaces/IRegister';
import getKeyByValue from '~/utils/getKeyByValue';

type Props = {};

export default function Mobile({}: Props) {
  const { t } = useTranslation();
  const toast = useToast();
  const methods = useForm<IRegisterRequest>({});
  const navigate = useNavigate();
  const onSubmit = async (data: IRegisterRequest) => {
    try {
      const response = await Auth.register({
        email: data.email,
        password: data.password,
        name: data.name,
        username: data.username,
      });
      toast({
        title: t('Success'),
        description: t('Success__Register'),
        status: 'success',
        position: 'top-right',
        duration: 1000,
        onCloseComplete: () => {
          navigate('/login');
        },
      });
    } catch (error: any) {
      const data1 = error.response.data;
      console.log(error);
      if (data1) {
        if (data1.message.includes('Duplicate')) {
          const value = data1.message.split(' ')[2];
          toast({
            title: t('Error'),
            description: (t('IsExist') as (x: string) => string)(
              getKeyByValue(data, (value as string).replaceAll("'", '')) || ''
            ),
            position: 'top-right',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        } else {
          toast({
            title: t('Error'),
            description: t('Error__Register'),
            position: 'top-right',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        toast({
          title: t('Error'),
          description: t('Error__Register'),
          position: 'top-right',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };
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
