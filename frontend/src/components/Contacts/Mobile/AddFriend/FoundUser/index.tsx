import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  Text,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import FriendsApi from '../../../../../services/apis/Friends.api';
import IFriendShip, { StatusCode } from '../../../../../interfaces/IFriendShip';
import { default as FoundUserDesktop } from '~/components/Modals/FoundUser';
import { IUser } from '../../../../../interfaces/IUser';
import { useAppSelector } from '~/app/hooks';

type Props = {};

export default function FoundUser({}: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { username } = useParams();
  const [showMoreAction, setShowMoreAction] = React.useState(false);
  const [user, setUser] = React.useState<IUser | null>(null);
  const friendShips = useAppSelector((state) => state.friendsSlice.friendShips);
  const friendShip = friendShips.find(
    (friendShip) => friendShip.user.username === username
  );
  useEffect(() => {
    if (username) {
      (async () => {
        const response = await FriendsApi.getUserByUsername(username);
        const data = response.data.data;
        setUser(data.user);
      })();
    }
  }, [username]);
  return user ? (
    <FoundUserDesktop
      user={user}
      friendShipId={friendShip ? friendShip._id : ''}
      friendShipStatusCode={friendShip ? friendShip.statusCode : null}
      flag={friendShip ? friendShip.flag : ''}
    />
  ) : (
    <div>null</div>
  );
  // return (
  //   <Flex direction={'column'} position="relative">
  //     <Flex
  //       gap="1rem"
  //       alignItems={'center'}
  //       paddingY=".5rem"
  //       bg="none"
  //       position={'fixed'}
  //       width="100%"
  //     >
  //       <IconButton
  //         aria-label="Back to contacts"
  //         bg="none"
  //         fontSize={'24px'}
  //         color="white"
  //         icon={<ArrowBackIcon />}
  //         onClick={() => navigate(-1)}
  //       />
  //       <IconButton
  //         aria-label="more action"
  //         bg="none"
  //         fontSize={'24px'}
  //         color="white"
  //         marginLeft="auto"
  //         onClick={() => setShowMoreAction(true)}
  //         icon={<FiMoreHorizontal />}
  //       />
  //     </Flex>
  //     {/* Profile photo  */}
  //     <Box height="200px">
  //       {/* Cover */}
  //       <Box width="full">
  //         <Image
  //           src="https://picsum.photos/130"
  //           alt=""
  //           width="100%"
  //           height="150px"
  //         />
  //       </Box>
  //       {/* Name and avatar */}
  //       <Flex
  //         justifyContent={'center'}
  //         alignItems="center"
  //         direction={'column'}
  //         position="relative"
  //         transform={'translateY(-32px)'}
  //       >
  //         <Avatar src={friendShip?.user.avatarUrl} size="lg" />
  //         <Text fontWeight={700}>{friendShip?.user.name}</Text>
  //       </Flex>
  //     </Box>
  //     <Flex gap="1rem" justifyContent={'center'} marginY="1rem" paddingX="1rem">
  //       <IconButton
  //         aria-label="Message"
  //         bg="blue.300"
  //         width="100%"
  //         _hover={{
  //           bg: 'blue.500',
  //         }}
  //         _active={{
  //           bg: 'blue.500',
  //         }}
  //         fontSize={'18px'}
  //         icon={
  //           <Flex gap=".5rem">
  //             <AiOutlineMessage />
  //             {t('Message')}
  //           </Flex>
  //         }
  //       />
  //       {friendShip?.statusCode ? (
  //         <IconButton
  //           aria-label="add"
  //           // _dark={{
  //           //   bg: 'white',
  //           //   color: 'white',
  //           // }}
  //           // bg="white"
  //           // color="black"
  //           fontSize={'18px'}
  //           icon={RenderIcon(friendShip.statusCode.code)}
  //         />
  //       ) : (
  //         <IconButton
  //           aria-label="add"
  //           // _dark={{
  //           //   bg: 'white',
  //           //   color: 'white',
  //           // }}
  //           // bg="white"
  //           // color="black"
  //           fontSize={'18px'}
  //           icon={<AiOutlineUserAdd size="24px" />}
  //         />
  //       )}
  //     </Flex>
  //     {showMoreAction && (
  //       <MoreActionModal setShow={() => setShowMoreAction(false)} />
  //     )}
  //   </Flex>
  // );
}
