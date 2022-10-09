import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import {
  Box,
  Button,
  CircularProgress,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import ChangeLanguage from '~/components/Settings/ChangeLanguage';
import background from '~/assets/images/bg_login.png';
import { useTranslation } from 'react-i18next';
import { BsFillPatchCheckFill } from 'react-icons/bs';
import { BiErrorAlt } from 'react-icons/bi';

import Auth from '~/services/apis/Auth.api';
import axios from 'axios';
import { MdCheckCircleOutline, MdOutlineErrorOutline } from 'react-icons/md';
import { useAppDispatch } from '~/app/hooks';
import { handleChangeLanguage } from '~/app/slices/global.slice';

type Props = {};

export default function Confirm({}: Props) {
  const x = useLocation();
  const query = queryString.parse(x.search) as {
    token: string;
    lan: 'en' | 'vn';
  };
  console.log(query);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!['en', 'vn'].includes(query.lan)) {
      navigate('/404');
    }
    dispatch(handleChangeLanguage(query.lan));
    (async () => {
      if (query.token) {
        try {
          setLoading(true);
          const res = await axios.post(
            `${process.env.REACT_APP_SERVER_URL}/api/auth/verifyAccount`,
            {
              token: query.token,
            }
          );
          console.log(res);
          if (res.data.statusCode === 200) {
            setTimeout(() => {
              setLoading(false);
            }, 200);
          } else {
            throw new Error('Error');
          }
        } catch (error) {
          setLoading(false);
          setError(true);
        }
      }
    })();
  }, []);
  return (
    <React.Fragment>
      {loading ? (
        <>
          <Modal
            isOpen={true}
            onClose={() => {
              console.log();
            }}
            closeOnEsc
          >
            <ModalContent marginY="auto">
              <ModalBody textAlign={'center'} padding="3rem">
                <CircularProgress isIndeterminate color="#338AE3" size="80px" />
              </ModalBody>
            </ModalContent>
          </Modal>
        </>
      ) : (
        <>
          <Modal
            isOpen={true}
            onClose={() => {
              console.log();
            }}
            closeOnEsc
          >
            <ModalContent marginY="auto">
              <ModalBody>
                <Text textAlign={'center'} fontSize="4xl">
                  {error ? t('Thanks__Title__Error') : t('Thanks__Title')}
                </Text>

                <Flex justifyContent={'center'}>
                  {error ? (
                    <MdOutlineErrorOutline size="80px" fill="#ed4337" />
                  ) : (
                    <MdCheckCircleOutline size="80px" fill="#338AE3" />
                  )}
                </Flex>
                <Text textAlign={'center'}>
                  {error ? t('Thanks__Content__Error') : t('Thanks__Content')}
                </Text>
              </ModalBody>
              <ModalFooter justifyContent={'center'}>
                <Button
                  bgColor={error ? '#ed4337' : '#338ae3'}
                  mr={3}
                  color="white"
                  onClick={() => {
                    navigate('/login');
                  }}
                >
                  {t('Back__To__Login')}
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
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
      ></Box>
    </React.Fragment>
  );
}
