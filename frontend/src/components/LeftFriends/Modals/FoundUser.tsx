import {
  Avatar,
  Box,
  Image,
  Text,
  Flex,
  IconButton,
  Button,
  Icon,
} from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlineIdcard, AiOutlineStop } from 'react-icons/ai';
import { GrGroup } from 'react-icons/gr';
import { MdOutlineGroups, MdOutlineReportGmailerrorred } from 'react-icons/md';

type Props = {};

export default function FoundUser({}: Props) {
  const { t } = useTranslation();
  return (
    <Box boxSizing="border-box" maxHeight={'600px'}>
      {/* Profile photo  */}
      <Box height="200px" marginX=".5rem">
        {/* Cover */}
        <Box width="full" height="130px">
          <Image
            src="https://picsum.photos/130"
            alt=""
            width="100%"
            height="130px"
          />
        </Box>
        {/* Name and avatar */}
        <Flex
          justifyContent={'center'}
          alignItems="center"
          direction={'column'}
          position="relative"
          transform={'translateY(-32px)'}
        >
          <Avatar src="https://picsum.photos/200" size="lg" />
          <Text fontWeight={700}> Poohuoc long</Text>
        </Flex>
      </Box>
      {/* action */}
      <Flex gap="1rem" justifyContent={'center'} marginX=".5rem">
        <Button width="50%">{t('AddFriend')}</Button>
        <Button width="50%">{t('Message')}</Button>
      </Flex>
      <Box
        border="3px solid rgba(0,0,0,0.02)"
        bg="rgba(0,0,0,0.02)"
        marginY={'1rem'}
      ></Box>
      {/* Profile Detail */}
      <Box marginX=".5rem">
        <Text size="2xl" fontWeight={700}>
          {t('PersonalInfo')}
        </Text>
        {/* Personal Info */}
      </Box>
      <Box
        border="3px solid rgba(0,0,0,0.02)"
        bg="rgba(0,0,0,0.02)"
        marginY={'1rem'}
      ></Box>
      <Flex direction={'column'}>
        <Button
          display={'block'}
          textAlign="left"
          bg="none"
          paddingX="0"
          padding="1rem"
          height="60px"
          rounded="none"
          fontWeight={'normal'}
        >
          <Flex direction="column" gap="1rem">
            <Flex gap="1rem">
              <MdOutlineGroups fontSize={'24px'} />
              <Box borderBottom="2px solid rgba(0,0,0,0.08)" width="100%">
                <Text>{t('CommonGroup')} (0)</Text>
              </Box>
            </Flex>
          </Flex>
        </Button>
        <Button
          display={'block'}
          textAlign="left"
          bg="none"
          padding="1rem"
          height="60px"
          rounded="none"
          fontWeight={'normal'}
        >
          <Flex direction="column" gap="1rem">
            <Flex gap="1rem">
              <AiOutlineIdcard fontSize={'24px'} />
              <Box borderBottom="2px solid rgba(0,0,0,0.08)" width="100%">
                <Text>{t('ShareContact')}</Text>
              </Box>
            </Flex>
          </Flex>
        </Button>
        <Button
          display={'block'}
          textAlign="left"
          bg="none"
          padding="1rem"
          height="60px"
          rounded="none"
          fontWeight={'normal'}
        >
          <Flex direction="column" gap="1rem">
            <Flex gap="1rem">
              <AiOutlineStop fontSize={'24px'} />
              <Box borderBottom="2px solid rgba(0,0,0,0.08)" width="100%">
                <Text>{t('Block')}</Text>
              </Box>
            </Flex>
          </Flex>
        </Button>
        <Button
          display={'block'}
          textAlign="left"
          bg="none"
          padding="1rem"
          height="60px"
          rounded="none"
          fontWeight={'normal'}
        >
          <Flex direction="column" gap="1rem">
            <Flex gap="1rem">
              <MdOutlineReportGmailerrorred fontSize={'24px'} />
              <Box borderBottom="2px solid rgba(0,0,0,0.08)" width="100%">
                <Text>{t('Report')}</Text>
              </Box>
            </Flex>
          </Flex>
        </Button>
      </Flex>
    </Box>
  );
}
