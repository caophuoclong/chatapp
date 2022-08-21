import { Flex, IconButton, useColorMode } from '@chakra-ui/react';
import React from 'react';
import { AiFillHome } from 'react-icons/ai';
import { RiContactsBook2Fill } from 'react-icons/ri';
import { FaUserAlt } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';

type Props = {};

export default function Footer({}: Props) {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const location = useLocation();
  return (
    <Flex
      marginTop="auto"
      minHeight="5%"
      boxSizing="border-box"
      display={{
        base: 'flex',
        lg: 'none',
      }}
      justifyContent="space-around"
      alignItems={'center'}
      gap="1rem"
      borderTop={
        colorMode === 'dark'
          ? '1px solid rgba(255, 255, 255,0.3)'
          : '1px solid  rgba(0, 0, 0, 0.08)'
      }
      paddingY=".5rem"
    >
      <IconButton
        aria-label="home"
        bg={
          location.pathname === '/'
            ? colorMode === 'dark'
              ? 'gray.700'
              : 'gray.200'
            : ''
        }
        icon={
          <AiFillHome
            size="24px"
            color={location.pathname === '/' ? '#63B3ED' : ''}
          />
        }
        onClick={() => {
          navigate('/');
        }}
      />
      <IconButton
        aria-label="contact"
        bg={
          location.pathname.includes('contacts')
            ? colorMode === 'dark'
              ? 'gray.700'
              : 'gray.200'
            : ''
        }
        onClick={() => {
          navigate('/contacts');
        }}
        icon={
          <RiContactsBook2Fill
            size="24px"
            color={location.pathname.includes('contacts') ? '#63B3ED' : ''}
          />
        }
      />
      <IconButton
        aria-label="user"
        bg={
          location.pathname.includes('user')
            ? colorMode === 'dark'
              ? 'gray.700'
              : 'gray.200'
            : ''
        }
        icon={
          <FaUserAlt
            size="24px"
            color={location.pathname.includes('user') ? '#63B3ED' : ''}
          />
        }
        onClick={() => {
          navigate('/user');
        }}
      />
    </Flex>
  );
}
