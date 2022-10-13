import { ArrowBackIcon } from '@chakra-ui/icons';
import { Flex, IconButton, Text } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Common, { CommonProps } from './Common';
import { withTranslation } from 'react-i18next';
import IConversation from '~/interfaces/IConversation';
import { RenderDirectConversationName } from '../../Conversations/Conversation/index';
interface MobileProps {
  conversation: IConversation;
  onHideInfoConversation: () => void;
}
class Mobile extends Common<MobileProps> {
  private handleHideInfoConversation: () => void;
  constructor(props: MobileProps) {
    super({ conversation: props.conversation });
    this.handleHideInfoConversation = props.onHideInfoConversation;
  }
  render() {
    return (
      <React.Fragment>
        <Flex
          display={{
            base: 'flex',
            lg: 'none',
          }}
          paddingX="1rem"
          paddingY=".3rem"
          bg="blue.500"
          color="white"
          alignItems={'center'}
        >
          <IconButton
            bg="none"
            aria-label="Back to message"
            icon={<ArrowBackIcon fontSize={'24px'} />}
            onClick={this.handleHideInfoConversation}
          />
          <Text fontWeight={600}>
            {this.props.conversation.type === 'direct' && (
              <RenderDirectConversationName
                participants={this.props.conversation.participants}
              />
            )}
            {this.props.conversation.type === 'group' &&
              this.props.conversation.name}
          </Text>
        </Flex>
        {super.render()}
      </React.Fragment>
    );
  }
}
export default withTranslation()(Mobile);
