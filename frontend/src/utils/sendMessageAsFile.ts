import { AppDispatch } from '~/app/store';
import { IUser } from '../interfaces/IUser';
import { createRawMessage } from './createRawMessage';
import { MessageType, IMessage } from '../interfaces/IMessage';
import { addMessage, updateSentMessage } from '~/app/slices/messages.slice';
import MessagesApi from '~/services/apis/Messages.api';
export const sendMessageAsFile = async (
  files: FileList | null,
  sender: IUser,
  destination: string,
  type: MessageType,
  lastMessage: IMessage,
  dispatch: AppDispatch
) => {
  const filesUrl = [];
  for (let i = 0; i < files!.length || 0; i++) {
    const url = window.URL.createObjectURL(files![i]);
    filesUrl.push(url);
    const newMessage = createRawMessage(type, url, sender, destination);
    dispatch(
      addMessage({
        message: newMessage,
        conversationId: destination,
      })
    );
    const data = new FormData();
    data.append('file', files![i]);
    data.append('message', JSON.stringify(newMessage));
    const response = await MessagesApi.sendFileMessage(
      data,
      (progress: ProgressEvent<EventTarget>) => {
        console.log(progress.loaded);
      }
    );
    dispatch(updateSentMessage({
        message: response.message,
        tempId:response.tempId,
        lastMessage
    }))

  }
};
