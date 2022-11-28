import { Avatar, Box, Flex } from '@chakra-ui/react';
import { SERVER_URL } from '~/configs';
import { IUser } from '~/interfaces/IUser';
import { renderAvatar } from '../../../utils/renderAvatar';
type Props1 = {
  children: React.ReactNode[];
  width: string;
  height: string;
};
const AvatarGroup: React.FC<Props1> = ({ children, width, height }) => {
  if (children.length < 4) {
    const [x0, x1, x2] = children;
    return (
      <Box width={width} height={height} position={'relative'}>
        <Flex justifyContent={'center'}>
          <Box>{x0}</Box>
        </Flex>
        <Flex position={'absolute'} bottom="5px">
          <Flex position={'relative'} width="100%">
            <Box>{x1}</Box>
            <Box position="absolute" right="-80%" zIndex="5">
              {x2}
            </Box>
          </Flex>
        </Flex>
      </Box>
    );
  } else {
    const [x0, x1, x2, ...x4] = children;
    return (
      <Box width={width} height={height}>
        <Flex position={'relative'}>
          <Box>{x0}</Box>
          <Box position="absolute" right="5px" zIndex="5">
            {x1}
          </Box>
        </Flex>
        <Flex position={'relative'}>
          <Box>{x2}</Box>
          {x4.length > 0 && (
            <Flex
              position="absolute"
              right="5px"
              zIndex="5"
              bgColor={'black'}
              width="26px"
              height="26px"
              rounded="full"
              justifyContent={'center'}
              alignItems="center"
            >
              {x4.length + 120}
            </Flex>
          )}
        </Flex>
      </Box>
    );
  }
};
export const AvatarConversation = ({
  avatarUrl,
  participants,
  size = 50,
  avatarSize,
}: {
  avatarUrl: string;
  participants: IUser[];
  size?: number;
  avatarSize?:
    | 'lg'
    | 'md'
    | 'sm'
    | 'xs'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl'
    | 'full';
}) => {
  if (avatarUrl) {
    return <Avatar size={avatarSize} src={renderAvatar(avatarUrl)} />;
  } else {
    return (
      <AvatarGroup width={`${size}px`} height={`${size}px`}>
        {participants.map((user, index) => {
          return (
            <Avatar
              width={`${size / 2}px`}
              height={`${size / 2}px`}
              key={index}
              src={renderAvatar(user.avatarUrl)}
            />
          );
        })}
      </AvatarGroup>
    );
  }
};
