import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Flex,
  IconButton,
  Input,
} from '@chakra-ui/react';
import { MdHeight } from 'react-icons/md';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { MdCallEnd } from 'react-icons/md';
import {
  BsFillCameraVideoFill,
  BsFillCameraVideoOffFill,
  BsFillMicMuteFill,
  BsMicFill,
  BsMicMuteFill,
} from 'react-icons/bs';
import { useAppSelector } from '~/app/hooks';
import { renderAvatar } from '~/utils/renderAvatar';
type Props = {};

export default function Call({}: Props) {
  const { search } = useLocation();
  const [stream, setStream] = useState<MediaStream>();
  const playBackVideo = useRef<HTMLVideoElement>(null);
  const previewVideo = useRef<HTMLVideoElement>(null);

  const [check, setCheck] = useState(false);
  const [mute, setMute] = useState(false);
  const [offVideo, setOffVideo] = useState(false);
  const user = useAppSelector((state) => state.userSlice.info);
  const {
    query: { audio, video },
  } = queryString.parseUrl(search);
  useEffect(() => {
    (async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: audio === 'true',
        video: video === 'true',
      });
      setStream(stream);
    })();
  }, [audio, video]);
  useEffect(() => {
    if (stream) {
      if (previewVideo.current && playBackVideo.current && !offVideo) {
        playBackVideo.current.srcObject = stream;
        playBackVideo.current.autoplay = true;
        previewVideo.current.srcObject = stream;
        previewVideo.current.autoplay = true;
      }
    }
  }, [stream, playBackVideo, offVideo]);
  const turnOffVideo = (newStream?: MediaStream) => {
    stream?.getVideoTracks().forEach((track) => {
      track.stop();
    });
  };
  const muteTrack = (newStream?: MediaStream) => {
    stream?.getAudioTracks().forEach((track) => {
      track.enabled = false;
    });
  };

  const turnOnVideo = async () => {
    stream?.getTracks().forEach((track) => {
      track.stop();
    });
    const constraints = {
      audio: true,
      video: true,
    };
    const newStream = await navigator.mediaDevices.getUserMedia(constraints);
    if (mute)
      newStream.getAudioTracks().forEach((track) => {
        track.enabled = false;
      });
    setStream(newStream);
  };
  const unMute = async () => {
    stream?.getAudioTracks().forEach((track) => (track.enabled = true));
  };
  const handleTurnOffVideo = () => {
    if (!offVideo) {
      turnOffVideo();
    } else {
      turnOnVideo();
    }
    setOffVideo(!offVideo);
  };
  const handleMute = async () => {
    if (!mute) {
      muteTrack();
    } else {
      unMute();
    }
    setMute(!mute);
  };

  return (
    <Flex
      width="100vw"
      height="100vh"
      direction="column"
      position={'relative'}
      boxSizing="border-box"
    >
      <video
        style={{
          objectFit: 'fill',
          width: '100%',
          height: '100%',
        }}
        ref={previewVideo}
        autoPlay
      ></video>
      <Flex
        justifyContent={'center'}
        alignItems="flex-end"
        position={'absolute'}
        width="95%"
        bottom="1rem"
        left="50%"
        transform={'translateX(-50%)'}
      >
        <Flex width="60%" justifyContent={'flex-end'} gap="1rem">
          <IconButton
            onClick={handleTurnOffVideo}
            aria-label="turn off video"
            icon={
              !offVideo ? (
                <BsFillCameraVideoOffFill size="24px" />
              ) : (
                <BsFillCameraVideoFill size="24px" />
              )
            }
            rounded="full"
          />
          <IconButton
            onClick={handleMute}
            aria-label="mute"
            rounded="full"
            icon={
              mute ? (
                <BsMicFill size="24px" />
              ) : (
                <BsFillMicMuteFill size="24px" />
              )
            }
          />
          <IconButton
            aria-label="end call"
            icon={<MdCallEnd size="24px" />}
            rounded="full"
            bg="red"
          />
        </Flex>
        <Flex
          width="40%"
          justifyContent={'flex-end'}
          alignItems="center"
          gap=".5rem"
        >
          <IconButton
            variant={'ghost'}
            aria-label="show - hide video play back"
            icon={check ? <IoChevronBack /> : <IoChevronForward />}
            as="label"
            htmlFor="hideVideoPlayBack"
            cursor={'pointer'}
          />
          <Checkbox
            checked={check}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setCheck(event.target.checked)
            }
            id="hideVideoPlayBack"
            hidden
            _checked={{
              '& ~ div': {
                width: '10px',
              },
            }}
          ></Checkbox>
          <Box
            w="300px"
            h="150px"
            transition="width .3s ease-in-out"
            position={'relative'}
          >
            {!check && mute && (
              <Box position={'absolute'} left={1} bottom={2} zIndex={10}>
                <BsMicMuteFill size="24px" />
              </Box>
            )}
            {!check && offVideo && (
              <Avatar
                zIndex={10}
                position={'absolute'}
                left="50%"
                top="50%"
                transform="translate(-50%, -50%)"
                src={renderAvatar(user.avatarUrl)}
              />
            )}
            {!offVideo ? (
              <video
                ref={playBackVideo}
                style={{
                  objectFit: 'fill',
                  width: '100%',
                  height: '100%',
                  borderRadius: '1rem',
                }}
              ></video>
            ) : (
              <Box
                zIndex={9}
                bg="black"
                w="full"
                h="full"
                rounded="1rem"
                bgImage={renderAvatar(user.avatarUrl)}
                bgSize="cover"
                bgPosition={'center'}
                filter="blur(2px)"
              ></Box>
            )}
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
}
