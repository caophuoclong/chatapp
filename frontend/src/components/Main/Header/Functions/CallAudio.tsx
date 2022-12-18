import { IconButton } from '@chakra-ui/react';
import React from 'react';
import { IoCallSharp } from 'react-icons/io5';
import { mediaOnlyAudio } from '~/constants/media';
import { IMediaConstraints } from '~/interfaces/IMediaContraints';

type Props = {
  openMediaDevices: (contraints: IMediaConstraints) => void;
};

export default function CallAudio({ openMediaDevices }: Props) {
  return (
    <React.Fragment>
      <IconButton
        bg="none"
        rounded="full"
        aria-label="Call"
        icon={<IoCallSharp />}
        onClick={() => openMediaDevices(mediaOnlyAudio)}
      />
    </React.Fragment>
  );
}
