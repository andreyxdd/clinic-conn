import React from 'react';
import {
  Box, IconButton, Typography, Modal, Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import CircularProgress from '@mui/material/CircularProgress';
import { useChat } from '../../context/ChatContext';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70vw',
  height: '95vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  borderRadius: '10px',
  boxShadow: 24,
  p: 1,
  display: 'table',
};

const VideoCallModal = () => {
  const {
    userVideoRef, currentChat, stream,
    openVideoCallModal, setOpenVideoCallModal,
  } = useChat();
  const handleClose = () => setOpenVideoCallModal(false);

  const [videoIsOn, setVideoIsOn] = React.useState(true);
  const [isMuted, setIsMuted] = React.useState(false);

  const handleVideoOffButton = () => {
    stream?.getTracks().forEach((track) => {
      if (track.kind === 'video') {
        // eslint-disable-next-line no-param-reassign
        track.enabled = false;
      }
    });
    setVideoIsOn(false);
  };

  const handleVideoOnButton = () => {
    stream?.getTracks().forEach((track) => {
      if (track.kind === 'video') {
        // eslint-disable-next-line no-param-reassign
        track.enabled = true;
      }
    });
    setVideoIsOn(true);
  };

  const handleAudioOffButton = () => {
    stream?.getTracks().forEach((track) => {
      if (track.kind === 'audio') {
        // eslint-disable-next-line no-param-reassign
        track.enabled = false;
      }
    });
    setIsMuted(true);
  };

  const handleAudioOnButton = () => {
    stream?.getTracks().forEach((track) => {
      if (track.kind === 'audio') {
        // eslint-disable-next-line no-param-reassign
        track.enabled = true;
      }
    });
    setIsMuted(false);
  };

  return (
    <Modal
      open={openVideoCallModal}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={style}>
        <Grid
          aria-label='top-container'
          container
          direction='row'
          justifyContent='space-between'
          alignItems='center'
        >
          <Grid item>
            <Typography variant='h5' gutterBottom>
              Call with
              {' '}
              <b>{currentChat?.participantUsername || 'Opposite User'}</b>
            </Typography>
          </Grid>
          <Grid>
            <IconButton
              component='span'
              onClick={handleClose}
            >
              <CloseIcon fontSize='large' />
            </IconButton>
          </Grid>

        </Grid>

        <Grid
          aria-label='video-container'
          container
          justifyContent='center'
          alignItems='center'
          sx={{ pt: 2 }}
          style={{ height: '85%' }}
        >
          {stream ? (
            <video
              style={{ height: '100%', zIndex: !videoIsOn ? -1 : 0 }}
              playsInline
              muted
              ref={userVideoRef}
              autoPlay
            />
          ) : <CircularProgress />}
        </Grid>

        <Grid
          aria-label='bottom-container'
          container
          direction='row'
          justifyContent='center'
          alignItems='center'
          sx={{ pt: 2 }}
          spacing={4}
        >
          <Grid item>
            {videoIsOn
              ? (
                <IconButton
                  onClick={handleVideoOffButton}
                  type='button'
                >
                  <VideocamIcon
                    fontSize='large'
                    sx={{
                      color: 'white',
                      backgroundColor: 'primary.main',
                      borderRadius: '50%',
                      p: 0.6,
                    }}
                  />
                </IconButton>
              )
              : (
                <IconButton
                  onClick={handleVideoOnButton}
                  type='button'
                >
                  <VideocamOffIcon
                    fontSize='large'
                    sx={{
                      color: 'white',
                      backgroundColor: 'error.light',
                      borderRadius: '50%',
                      p: 0.6,
                    }}
                  />
                </IconButton>
              )}
          </Grid>
          <Grid item>
            {!isMuted
              ? (
                <IconButton
                  onClick={handleAudioOffButton}
                  type='button'
                >
                  <MicIcon
                    fontSize='large'
                    sx={{
                      color: 'white',
                      backgroundColor: 'primary.main',
                      borderRadius: '50%',
                      p: 0.6,
                    }}
                  />
                </IconButton>
              )
              : (
                <IconButton
                  onClick={handleAudioOnButton}
                  type='button'
                >
                  <MicOffIcon
                    fontSize='large'
                    sx={{
                      color: 'white',
                      backgroundColor: 'error.light',
                      borderRadius: '50%',
                      p: 0.6,
                    }}
                  />
                </IconButton>
              )}
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default VideoCallModal;
