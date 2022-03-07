import { useCallback, useState } from 'react';
import {
  Box,
  Typography,
  Modal,
  Button,
  TextField,
  Grid,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { useChat } from '../../context/ChatContext';
import { IChat, IMessage } from '../../config/types';
import { poster } from '../../lib/auth/csr';
import env from '../../config/env';
import events from '../../config/events';

interface IModalFormProps {
  initiatorUsername: string;
  targetUsername: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const boxStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

const StartChatModal = ({
  initiatorUsername, targetUsername, open, setOpen,
}: IModalFormProps) => {
  const [modalTextField, setModaltextfield] = useState({
    text: '',
    helper: '',
    error: false,
    disabled: false,
  });
  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();
  const { chats, setChats, socket } = useChat();

  const handleModalTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentMsgText = (e.target as HTMLInputElement).value;
    setModaltextfield({
      ...modalTextField,
      text: currentMsgText,
      helper: '',
      error: false,
    });
  };

  const handleClose = useCallback(() => {
    setOpen(false);
    setModaltextfield({
      ...modalTextField,
      text: '',
      disabled: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    if (modalTextField.text) {
      setModaltextfield({
        ...modalTextField,
        disabled: true,
      });

      const res = await poster<{ chatId: number }>(
        `${env.api}/chat/create`, { target: targetUsername },
      );

      console.log(res);

      if (res.data && res.data.chatId) {
        if (!socket) return;

        const content: IMessage = {
          username: initiatorUsername,
          text: modalTextField.text,
          sentAt: new Date(),
          readAt: null,
        };

        // chat already exists
        if (chats.map((c: IChat) => c.chatId).includes(res.data.chatId)) {
          // emitting message to the existing chat
          socket!.emit(events.CLIENT.SEND_MESSAGE, {
            content,
            chatId: res.data.chatId,
          });

          // updating chats array to indicate active chat
          // and adding a new message
          setChats((currChats: Array<IChat>) => {
            const updatedChats = currChats.map((chat: IChat) => {
              if (chat.chatId === res.data!.chatId) {
                return {
                  ...chat,
                  active: true,
                  messages: [...chat.messages, content],
                };
              }
              return { ...chat, active: false };
            });
            return updatedChats;
          });
        } else { // new chat
          // common newChat object
          const newChat = {
            chatId: res.data!.chatId,
            messages: [content],
          };

          // emitting message to the new chat
          socket!.emit(events.CLIENT.SEND_MESSAGE, {
            content,
            chatId: res.data.chatId,
            newChat: { ...newChat, participantUsername: initiatorUsername },
            targetUsername,
          });

          setChats((currChats: Array<IChat>) => {
            const updatedChats = currChats.map((chat: IChat) => (
              { ...chat, active: false }
            ));
            return [...updatedChats, {
              ...newChat,
              active: true,
              participantUsername: targetUsername,
            }];
          });
        }

        handleClose();

        router.push('/chat');
      } else {
        enqueueSnackbar(
          'Can\'t intiate a chat. Please, report an issue.',
          { variant: 'error' },
        );
      }
    } else {
      setModaltextfield({
        ...modalTextField,
        helper: 'Empty message cannot be submitted',
        error: true,
      });
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={boxStyle}>
        <Grid
          container
          justifyContent='center'
          alignContent='center'
          spacing={2}
        >
          <Grid item xs={12}>
            <Typography id='modal-modal-title' variant='h6'>
              Chat with
              {' '}
              {targetUsername}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography id='modal-modal-description'>
              Input your message below:
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              onChange={handleModalTextFieldChange}
              value={modalTextField.text}
              fullWidth
              placeholder={`Hi ${targetUsername}. Let's start chatting!`}
              multiline
              rows={8}
              helperText={modalTextField.helper}
              error={modalTextField.error}
              disabled={modalTextField.disabled}
            />
          </Grid>
          <Grid
            item
            container
            justifyContent='space-evenly'
            alignItems='center'
            xs={12}
            direction='row'
          >
            <Grid item>
              <Button
                onClick={handleSubmit}
                variant='contained'
                style={{ width: 150 }}
                disabled={modalTextField.disabled}
                type='button'
              >
                Submit
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={handleClose}
                variant='outlined'
                color='error'
                style={{ width: 150 }}
                disabled={modalTextField.disabled}
                type='button'
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default StartChatModal;
