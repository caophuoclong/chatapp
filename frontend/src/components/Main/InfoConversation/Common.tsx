import { Search2Icon } from '@chakra-ui/icons';
import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Flex,
  IconButton,
  StackDivider,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { Component } from 'react';
import { BsBellFill } from 'react-icons/bs';
import { AvatarConversation } from '~/components/Conversations/Conversation/AvatarConversation';
import { SERVER_URL } from '~/configs';
import IConversation from '~/interfaces/IConversation';
import {
  RenderDirectConversationAvatar,
  RenderDirectConversationName,
} from '../../Conversations/Conversation/index';

export interface CommonProps {
  conversation: IConversation;
}
export default class Common<T> extends Component<CommonProps> {
  constructor(props: CommonProps) {
    super(props);
  }
  render() {
    return (
      <React.Fragment>
        <Flex
          alignItems={'center'}
          justifyContent="center"
          direction={'column'}
          marginY="1rem"
        >
          {this.props.conversation.type === 'direct' && (
            <RenderDirectConversationAvatar
              participants={this.props.conversation.participants}
            />
          )}
          {this.props.conversation.type === 'group' && (
            <AvatarConversation
              avatarUrl={this.props.conversation.avatarUrl}
              participants={this.props.conversation.participants}
            />
          )}
          {this.props.conversation.type === 'direct' && (
            <Text fontWeight={600} noOfLines={1}>
              <RenderDirectConversationName
                participants={this.props.conversation.participants}
              />
            </Text>
          )}
          {this.props.conversation.type === 'group' && (
            <Text fontWeight={600} noOfLines={1}>
              {this.props.conversation.name}
            </Text>
          )}
        </Flex>
        <Flex alignItems="center" justifyContent={'center'} gap="1rem">
          <IconButton
            aria-label="Search message"
            rounded="full"
            icon={<Search2Icon />}
          />
          <IconButton
            aria-label="on/off noti"
            rounded="full"
            icon={<BsBellFill />}
          />
        </Flex>
        <VStack
          margin="1rem"
          align="stretch"
          divider={<StackDivider borderColor="gray.200" />}
        >
          <Box>
            <Button>Emoji</Button>
            <Text>123</Text>
            <Text>123</Text>
          </Box>
          <Box>
            <Text>123</Text>
            <Text>123</Text>
            <Text>123</Text>
          </Box>
          <Box>
            <Text>123</Text>
            <Text>123</Text>
            <Text>123</Text>
          </Box>
        </VStack>
      </React.Fragment>
    );
  }
}
