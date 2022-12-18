import { IMediaConstraints } from '../interfaces/IMediaContraints';

export const mediaContraints: IMediaConstraints = {
  audio: true,
  video: true,
};
export const mediaOnlyAudio: IMediaConstraints = {
    audio: true,
    video: false,
 };

export const mediaSize = {
width: 1280,
height: 720,
}