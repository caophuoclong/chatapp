import { Avatar, Box, Flex, IconButton } from '@chakra-ui/react';
import React from 'react';
import { AiFillHome } from 'react-icons/ai';
import { FaUserAlt } from 'react-icons/fa';
import { RiContactsBook2Fill } from 'react-icons/ri';
import { useLocation, useNavigate } from 'react-router-dom';

type Props = {};

export default function LeftFunction({}: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <Flex
      display={{
        base: 'none',
        lg: 'flex',
      }}
      width={'20%'}
      //   bg="red.100"
      borderRight="solid 1px rgba(0, 0, 0, 0.08)"
      paddingY="1rem"
      boxSizing="border-box"
      direction="column"
      alignItems={'center'}
    >
      <Avatar src="https://picsum.photos/200" marginY="1rem" />
      <IconButton
        height="60px"
        aria-label="home"
        width="full"
        bg={
          location.pathname === '/' || location.pathname.includes('message')
            ? 'gray.200'
            : ''
        }
        icon={
          <AiFillHome
            size="32px"
            color={
              location.pathname === '/' || location.pathname.includes('message')
                ? '#63B3ED'
                : ''
            }
          />
        }
        onClick={() => {
          navigate('/');
        }}
      />
      <IconButton
        height="60px"
        aria-label="home"
        width="full"
        bg={location.pathname === '/friends' ? 'bg.200' : ''}
        icon={
          <RiContactsBook2Fill
            size="32px"
            color={location.pathname === '/friends' ? '#63B3ED' : ''}
          />
        }
        onClick={() => {
          navigate('/friends');
        }}
      />
      {/* <IconButton
        height="60px"
        aria-label="home"
        width="full"
        bg={''}
        icon={
          <FaUserAlt
            size="32px"
            // color={location.pathname === '/' ? '#63B3ED' : ''}
          />
        }
        onClick={() => {
          //   navigate('/');
        }}
      /> */}
    </Flex>
  );
}
