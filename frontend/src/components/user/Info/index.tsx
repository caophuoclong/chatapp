import React, { MouseEvent, useEffect, useState } from 'react';
import {
  AvatarBadge,
  AvatarGroup,
  Box,
  Button,
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
import {
  Avatar,
  Flex,
  Text,
  InputGroup,
  Input,
  InputRightAddon,
} from '@chakra-ui/react';
import { AiFillCamera, AiOutlineEdit } from 'react-icons/ai';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import vi from 'date-fns/locale/vi';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { BsCheckLg } from 'react-icons/bs';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useColorMode } from '@chakra-ui/react';
import { IUser } from '../../../interfaces/IUser';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import UserApi from '~/services/apis/User.api';
import { updateInformation } from '~/app/slices/user.slice';
import readFile from '~/utils/readFile';
import { Blob } from 'buffer';
import { SERVER_URL } from '~/configs';
type Props = {
  user: IUser;
  id?: string;
};

export default function Info({ user, id }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const schema = yup.object().shape({
    email: yup
      .string()
      .email(t('Invalid__Email'))
      .required(t('Email__Required')),
    name: yup.string().required(t('Name__Required')),
    date: yup
      .number()
      .typeError(t('Date__Required'))
      .required(t('Date__Required'))
      .test('is-date', t('Date__29'), function (value) {
        const month = this.parent.month;
        const year = this.parent.year;
        const isLeapYear = moment(year).isLeapYear();
        if (month < 1 || month > 12) return true;
        if (month === 2 && value) {
          if (isLeapYear) {
            return value <= 29;
          }
          return value <= 28;
        }
        return true;
      })
      .test('is-31', t('Date__31'), function (value) {
        const month = this.parent.month;
        if (
          (month === 1 ||
            month === 3 ||
            month === 5 ||
            month === 7 ||
            month === 8 ||
            month === 10 ||
            month === 12) &&
          value
        ) {
          return value <= 31;
        }
        return true;
      })
      .test('is-30', t('Date__30'), function (value) {
        const month = this.parent.month;
        if (
          (month === 4 || month === 6 || month === 9 || month === 11) &&
          value
        ) {
          return value <= 30;
        }
        return true;
      }),
    month: yup
      .number()
      .typeError(t('Month__Required'))
      .required(t('Month__Required'))
      .max(12)
      .min(1),
    year: yup
      .number()
      .typeError(t('Year__Required'))
      .required(t('Year__Required'))
      .max(new Date().getFullYear() - 1, t('Year__Max'))
      .min(1900, t('Year__Min')),
    phone: yup
      .string()
      .test('is-phone', t('Phone__Invalid'), function (value) {
        const reg = new RegExp(/(84|0[3|5|7|8|9])+([0-9]{8})\b/);
        if (value) {
          return reg.test(value);
        }
        return true;
      })
      .nullable(),
  });
  const [birthday, setBirtday] = useState<{
    date: number;
    month: number;
    year: number;
  }>({
    date: 15,
    month: 1,
    year: 2000,
  });
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: user.name,
      gender: user.gender,
      date: +('0' + birthday.date).slice(-2),
      month: +('0' + birthday.month).slice(-2),
      year: birthday.year,
      phone: user.phone,
      email: user.email,
    },
    mode: 'onChange',
  });
  const toast = useToast();
  const onSubmit = handleSubmit(async (data) => {
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
  const { colorMode } = useColorMode();
  const [isEnalbeInput, setIsEnabledInput] = useState(false);
  const lan = useAppSelector((state) => state.globalSlice.lan);
  const myId = useAppSelector((state) => state.userSlice.info._id);
  const [fileAvatar, setFileAvatar] = useState<{
    file: File;
    name: string;
  }>();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isChangeAvatar, setIsChangeAvatar] = useState(false);
  const [cover, setCover] = useState<string | null>(null);
  const [isChangeCover, setIsChangeCover] = useState(false);
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
  const handleEnalbeInput = () => {
    const inputArray = document.querySelectorAll('.input__info');
    if (!isEnalbeInput) {
      inputArray.forEach((value) => {
        (value as HTMLInputElement | HTMLButtonElement).removeAttribute(
          'disabled'
        );
      });
      setIsEnabledInput(true);
    } else {
      inputArray.forEach((value) => {
        (value as HTMLInputElement | HTMLButtonElement).setAttribute(
          'disabled',
          'true'
        );
      });
      setIsEnabledInput(false);
    }
  };
  const handleCancle = () => {
    setValue('name', user.name);
    setValue('email', user.email);
    setValue('phone', user.phone);
    setValue('date', birthday.date);
    setValue('month', birthday.month);
    setValue('year', birthday.year);
    setValue('gender', user.gender);
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
    console.log(user);
    const birthday1 = user.birthday;
    if (birthday1)
      if (birthday1.includes('-')) {
        setBirtday({
          date: +birthday1.split('-')[0],
          month: +birthday1.split('-')[1],
          year: +birthday1.split('-')[2],
        });
      } else if (birthday1.includes('/')) {
        setBirtday({
          date: +birthday1.split('/')[0],
          month: +birthday1.split('/')[1],
          year: +birthday1.split('/')[2],
        });
      } else if (birthday1.includes('.')) {
        setBirtday({
          date: +birthday1.split('.')[0],
          month: +birthday1.split('.')[1],
          year: +birthday1.split('.')[2],
        });
      }
  }, [user]);
  useEffect(() => {
    setValue('date', birthday.date);
    setValue('month', birthday.month);
    setValue('year', birthday.year);
  }, [birthday]);
  useEffect(() => {
    if (uploadAvatarProgress === 100) {
      setTimeout(() => {
        handleRemoveAvatar();
        setUploadAvatarProgress(0);
      }, 1000);
    }
  }, [uploadAvatarProgress]);
  return (
    <form onSubmit={onSubmit}>
      <Flex
        justifyContent={'center'}
        alignItems="center"
        direction={'column'}
        gap="5px"
      >
        {user._id === myId ? (
          <div>
            <Avatar
              position={'relative'}
              width="72px"
              height="72px"
              role="group"
              src={avatar ? avatar : `${SERVER_URL}/images/${user.avatarUrl}`}
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
                  <CircularProgress value={uploadAvatarProgress} opacity={1} />
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
          </div>
        ) : (
          <Avatar
            width="72px"
            height="72px"
            src={`${SERVER_URL}/images/${user.avatarUrl}`}
          ></Avatar>
        )}
        <Tooltip
          hasArrow
          label={errors.name?.message}
          isOpen={errors.name ? true : false}
          placement="top-end"
        >
          <Input
            disabled={!isEnalbeInput}
            _disabled={{
              color: colorMode === 'light' ? 'black' : 'white',
            }}
            textAlign={'center'}
            variant="unstyled"
            border={'none'}
            {...register('name')}
          />
        </Tooltip>

        <Text fontSize={'12px'}>@{user.username}</Text>
      </Flex>
      <VStack spacing="3" divider={<StackDivider />}>
        <Flex alignItems="center" height="fit-content" width="100%" gap="1rem">
          <Text fontWeight={700} minWidth="80px">
            {t('Gender')}
          </Text>
          <Controller
            control={control}
            name={'gender'}
            render={({ field }) => (
              <RadioGroup isDisabled={!isEnalbeInput} {...field}>
                <HStack gap="1rem">
                  <Radio value="male">{t('Male')}</Radio>
                  <Radio value="female">{t('Female')}</Radio>
                  <Radio value="other">{t('Other')}</Radio>
                </HStack>
              </RadioGroup>
            )}
          />
        </Flex>
        <Flex alignItems="center" height="fit-content" width="100%" gap="1rem">
          <Text fontWeight={700} minWidth="80px">
            {t('DOB')}
          </Text>
          <Flex gap=".5rem">
            <Tooltip
              hasArrow
              label={errors.date?.message}
              isOpen={
                errors.date && !errors.month && !errors.year ? true : false
              }
              placement="top"
            >
              <Input
                w="30px"
                type="number"
                disabled={!isEnalbeInput}
                variant={'unstyled'}
                placeholder="dd"
                {...register('date')}
              />
            </Tooltip>
            /
            <Tooltip
              hasArrow
              label={errors.month?.message}
              isOpen={errors.month && !errors.year ? true : false}
              placement="top-end"
            >
              <Input
                w="30px"
                type="number"
                disabled={!isEnalbeInput}
                variant={'unstyled'}
                placeholder="mm"
                max={12}
                {...register('month')}
              />
            </Tooltip>
            /
            <Tooltip
              hasArrow
              label={errors.year?.message}
              isOpen={errors.year ? true : false}
              placement="top-end"
            >
              <Input
                w="15%"
                type="number"
                disabled={!isEnalbeInput}
                variant={'unstyled'}
                placeholder="yyyy"
                {...register('year')}
              />
            </Tooltip>
          </Flex>
        </Flex>
        <Flex alignItems="center" height="fit-content" width="100%" gap="1rem">
          <Text fontWeight={700} minWidth="80px">
            {t('Email')}
          </Text>
          <Tooltip
            hasArrow
            label={errors.email?.message}
            isOpen={errors.email ? true : false}
            placement="top-end"
          >
            <Input
              className="input__info"
              disabled={!isEnalbeInput}
              _disabled={{
                color: colorMode === 'light' ? 'black' : 'white',
              }}
              outline="none"
              border={'none'}
              variant="unstyled"
              {...register('email')}
            />
          </Tooltip>
        </Flex>
        <Flex alignItems="center" height="fit-content" width="100%" gap="1rem">
          <Text fontWeight={700} minWidth="120px">
            {t('Phone')}
          </Text>
          <Tooltip
            hasArrow
            label={errors.phone?.message}
            isOpen={errors.phone ? true : false}
            placement="top-end"
          >
            <Input
              className="input__info"
              {...register('phone')}
              disabled={!isEnalbeInput}
              _disabled={{
                color: colorMode === 'light' ? 'black' : 'white',
              }}
              outline="none"
              border={'none'}
              variant="unstyled"
            />
          </Tooltip>
        </Flex>
      </VStack>
      {user._id === myId ? (
        !isEnalbeInput ? (
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
                <Flex alignItems="center" justifyContent={'center'} gap="1rem">
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
                <Flex alignItems="center" justifyContent={'center'} gap="1rem">
                  <FaTimes size="24px" color="red" />
                  {t('Decline')}
                </Flex>
              }
            />
          </Flex>
        )
      ) : (
        ''
      )}
    </form>
  );
}
