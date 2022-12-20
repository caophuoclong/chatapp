import React, { MouseEvent, useEffect, useState } from 'react';
import {
  AvatarBadge,
  CircularProgress,
  HStack,
  IconButton,
  Radio,
  RadioGroup,
  StackDivider,
  Tooltip,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { Avatar, Flex, Text, Input } from '@chakra-ui/react';
import { AiFillCamera, AiOutlineEdit } from 'react-icons/ai';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import vi from 'date-fns/locale/vi';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { BsCheckLg } from 'react-icons/bs';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useColorMode } from '@chakra-ui/react';
import { IUser } from '../../../interfaces/IUser';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import UserApi from '~/services/apis/User.api';
import { updateInformation } from '~/app/slices/user.slice';
import readFile from '~/utils/readFile';
import { renderAvatar } from '../../../utils/renderAvatar';
import { schema } from './schema';
import Gender from './gender';
import DOB from './dob';
import Email from './email';
import PhoneNumber from './phoneNumber';
import Name from './name';
import ChangePassword from './changePassword';
type Props = {
  user: IUser;
  id?: string;
};

export default function Info({ user, id }: Props) {
  // TODO: init
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [isEnableInput, setIsEnabledInput] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isChangeAvatar, setIsChangeAvatar] = useState(false);
  const [fileAvatar, setFileAvatar] = useState<{
    file: File;
    name: string;
  }>();
  const [birthday, setBirtday] = useState<{
    date: number;
    month: number;
    year: number;
  }>({
    date: 1,
    month: 1,
    year: 1,
  });
  const method = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: user.name,
      gender: user.gender,
      date: birthday.date,
      month: birthday.month,
      year: birthday.year,
      phone: user.phone,
      email: user.email,
    },
    mode: 'onChange',
  });
  const toast = useToast();
  const onSubmit = method.handleSubmit(async (data) => {
    try {
      const birthday = `${data.date}/${data.month}/${data.year}`;
      const data1: Partial<typeof data> & {
        birthday?: string;
      } = {
        ...data,
        birthday,
      };
      delete data1.date;
      delete data1.month;
      delete data1.year;
      const response = await UserApi.updateInfoMation({
        ...data,
        birthday,
      });
      dispatch(updateInformation(data1));
      toast({
        title: t('Success'),
        description: t('Success__Update__Info'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: t('Error'),
        description: t('Fail__Update__Info'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    setIsEnabledInput(false);
  });
  const myId = useAppSelector((state) => state.userSlice.info._id);
  const [uploadAvatarProgress, setUploadAvatarProgress] = useState(0);
  const handleOnInputAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      const file1 = e.target.files[0];
      setFileAvatar({
        file: file1,
        name: new Date().getTime + '-' + file1.name,
      });
      setIsChangeAvatar(true);
    }
  };
  useEffect(() => {
    if (fileAvatar && isChangeAvatar) {
      readFile(fileAvatar.file).then((data) => {
        setAvatar(data);
      });
    }
    if (!fileAvatar && !isChangeAvatar) {
      setAvatar(null);
    }
  }, [fileAvatar]);
  const handleEnalbeInput = () => setIsEnabledInput(!isEnableInput);
  const handleCancle = () => {
    method.setValue('name', user.name);
    method.setValue('email', user.email);
    method.setValue('phone', user.phone);
    method.setValue('date', birthday.date);
    method.setValue('month', birthday.month);
    method.setValue('year', birthday.year);
    method.setValue('gender', user.gender);
  };
  const handleRemoveAvatar = () => {
    setAvatar(null);
    setIsChangeAvatar(false);
    setFileAvatar(undefined);
  };
  const onAcceptChangeAvatar = async () => {
    try {
      if (fileAvatar) {
        const formData = new FormData();
        setUploadAvatarProgress(1);
        formData.append('file', fileAvatar.file);
        const response = await UserApi.updateAvatar(
          formData,
          (e: ProgressEvent) => {
            const percent = Math.round((e.loaded * 100) / e.total);
            setUploadAvatarProgress(percent);
          }
        );
        const { fileName } = response;
        dispatch(
          updateInformation({
            avatarUrl: fileName,
          })
        );
      }
    } catch (error) {
      console.log(error);
      handleRemoveAvatar();
    }
  };
  useEffect(() => {
    if (user.birthday) {
      const [date, month, year] = user.birthday.split(/[-/.]/).map(Number);
      setBirtday({
        date,
        month,
        year,
      });
      method.setValue('date', date);
      method.setValue('month', month);
      method.setValue('year', year);
    }
  }, [user]);

  useEffect(() => {
    if (uploadAvatarProgress === 100) {
      setTimeout(() => {
        handleRemoveAvatar();
        setUploadAvatarProgress(0);
      }, 1000);
    }
  }, [uploadAvatarProgress]);
  return (
    <FormProvider {...method}>
      <form onSubmit={onSubmit}>
        <Flex
          justifyContent={'center'}
          alignItems="center"
          direction={'column'}
          gap="5px"
        >
          {user._id === myId ? (
            <React.Fragment>
              <Avatar
                position={'relative'}
                width="72px"
                height="72px"
                role="group"
                src={avatar ? avatar : renderAvatar(user.avatarUrl)}
              >
                {uploadAvatarProgress > 0 && uploadAvatarProgress <= 100 && (
                  <Flex
                    width={'72px'}
                    height={'72px'}
                    backdropFilter="auto"
                    backdropContrast="60%"
                    position={'absolute'}
                    rounded="full"
                    justifyContent={'center'}
                    alignItems={'center'}
                  >
                    <CircularProgress
                      value={uploadAvatarProgress}
                      opacity={1}
                    />
                  </Flex>
                )}
                {isChangeAvatar && (
                  <IconButton
                    position={'absolute'}
                    size="xs"
                    textAlign={'center'}
                    rounded="full"
                    top="0"
                    right="0"
                    visibility={'hidden'}
                    aria-label="remove avatar upload"
                    onClick={handleRemoveAvatar}
                    icon={<FaTimes />}
                    _groupHover={{
                      visibility: 'visible',
                    }}
                  />
                )}
                {isChangeAvatar ? (
                  <IconButton
                    position={'absolute'}
                    size="xs"
                    textAlign={'center'}
                    rounded="full"
                    bottom="0"
                    right="0"
                    visibility={'visible'}
                    aria-label="accept change avatar"
                    onClick={onAcceptChangeAvatar}
                    color="green.300"
                    icon={<FaCheck />}
                  />
                ) : (
                  <label
                    htmlFor="upload-avatar"
                    style={{
                      cursor: 'pointer',
                    }}
                  >
                    <AvatarBadge
                      borderColor="papayawhip"
                      bg="gray"
                      boxSize="1.25em"
                      children={<AiFillCamera color="#f5f5f5" />}
                    />
                  </label>
                )}
              </Avatar>
              <Input
                type="file"
                hidden
                id="upload-avatar"
                accept="image/png, image/gif, image/jpeg"
                onChange={handleOnInputAvatarChange}
              />
            </React.Fragment>
          ) : (
            <Avatar
              width="72px"
              height="72px"
              src={renderAvatar(user.avatarUrl)}
            ></Avatar>
          )}
          <Name isEnableInput={isEnableInput} />
          <Text fontSize={'12px'}>@{user.username}</Text>
        </Flex>
        <VStack spacing="3" divider={<StackDivider />}>
          {/* Gender */}
          <Gender
            isEnableInput={isEnableInput}
            control={method.control}
            name="gender"
          />
          {/* DOB */}
          <DOB isEnableInput={isEnableInput} />
          {/* Email */}
          <Email isEnableInput={isEnableInput} />
          {/* PhoneNumber */}
          <PhoneNumber isEnableInput={isEnableInput} />
          {/* Password */}
          {user._id === myId && <ChangePassword />}
        </VStack>
        {user._id === myId ? (
          <React.Fragment>
            {!isEnableInput ? (
              <IconButton
                display="flex"
                width="90%"
                marginY="10px"
                marginX="auto"
                aria-label="edit info"
                gap="1rem"
                onClick={() => handleEnalbeInput()}
                icon={
                  <>
                    <AiOutlineEdit size="24px" />
                    <Text fontSize={'12px'}>{t('Edit')}</Text>
                  </>
                }
              />
            ) : (
              <Flex justifyContent="space-around" marginY="1rem">
                <IconButton
                  aria-label="Accept"
                  padding="1rem"
                  type="submit"
                  icon={
                    <Flex
                      alignItems="center"
                      justifyContent={'center'}
                      gap="1rem"
                    >
                      <BsCheckLg size="24px" color="green" />
                      {t('Accept')}
                    </Flex>
                  }
                />
                <IconButton
                  aria-label="Decline"
                  padding="1rem"
                  onClick={() => {
                    handleEnalbeInput();
                    handleCancle();
                  }}
                  icon={
                    <Flex
                      alignItems="center"
                      justifyContent={'center'}
                      gap="1rem"
                    >
                      <FaTimes size="24px" color="red" />
                      {t('Decline')}
                    </Flex>
                  }
                />
              </Flex>
            )}
          </React.Fragment>
        ) : (
          ''
        )}
      </form>
    </FormProvider>
  );
}
