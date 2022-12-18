import { IconButton } from '@chakra-ui/react';
import React from 'react';
import { BsCameraVideoFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { IMediaConstraints } from '~/interfaces/IMediaContraints';
import { mediaContraints } from '../../../../constants/media';

type Props = {
  openMediaDevices: (contraints: IMediaConstraints) => void;
};

export default function CallVideo({ openMediaDevices }: Props) {
  return (
    <React.Fragment>
      <IconButton
        bg="none"
        rounded="full"
        aria-label="Call video"
        icon={<BsCameraVideoFill />}
        onClick={() => {
          window.open(
            `/makecall?audio=true&video=true`,
            '_blank',
            'toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=1280,height=720'
          );
        }}
      />
    </React.Fragment>
  );
}
